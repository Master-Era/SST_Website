import React, { useState } from "react";
import { adminApi } from "../../services/api";
import { mediaUrl } from "../../services/content";
import { addLog, load, nextId, save, validateAdminImage } from "../utils/store";
import { defaultWebsiteData } from "../data/defaultData";

const normalizeOrder = (items = []) =>
  items.map((item, index) => ({ ...item, sortOrder: index + 1 }));

const moveItem = (items, fromIndex, toIndex) => {
  const next = [...items];
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= next.length || toIndex >= next.length) return next;
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return normalizeOrder(next);
};

export default function GalleryEdit() {
  const [w, setW] = useState(load("website", defaultWebsiteData));
  const [edit, setEdit] = useState(null);
  const [view, setView] = useState(null);
  const [uploading, setUploading] = useState(false);
  const albums = normalizeOrder(w.gallery?.albums || []);

  const persist = (nextAlbums) => {
    const ordered = normalizeOrder(nextAlbums);
    const next = { ...w, gallery: { ...(w.gallery || {}), albums: ordered } };
    setW(next);
    save("website", next);
    addLog("Gallery updated");
  };

  const saveAlbum = () => {
    if (!edit) return;
    const exists = albums.some((album) => album.id === edit.id);
    const maxPosition = exists ? albums.length : albums.length + 1;
    const position = Math.min(Math.max(Number(edit.sortOrder) || maxPosition, 1), maxPosition);
    const withoutCurrent = albums.filter((album) => album.id !== edit.id);
    withoutCurrent.splice(position - 1, 0, { ...edit, sortOrder: position });
    persist(withoutCurrent);
    setEdit(null);
  };

  const moveAlbum = (index, direction) => {
    const target = direction === "up" ? index - 1 : index + 1;
    persist(moveItem(albums, index, target));
  };

  const uploadFile = async (file) => {
    const uploaded = await adminApi.upload(file);
    return uploaded.url || uploaded.image_url || uploaded.path;
  };

  const addImages = async (event) => {
    const files = [...(event.target.files || [])];
    if (!files.length) return;

    const invalidFile = files.find((file) => !validateAdminImage(file).ok);
    if (invalidFile) {
      window.alert(validateAdminImage(invalidFile).message);
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        uploaded.push({ id: `${Date.now()}-${index}`, name: file.name, src: await uploadFile(file) });
      }
      setEdit((current) => ({ ...current, images: [...(current.images || []), ...uploaded] }));
    } catch (error) {
      window.alert(error?.message || "One or more photos could not be uploaded.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const setCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validation = validateAdminImage(file);
    if (!validation.ok) {
      window.alert(validation.message);
      event.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const cover = await uploadFile(file);
      setEdit((current) => ({ ...current, cover }));
    } catch (error) {
      window.alert(error?.message || "Cover image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const movePhoto = (index, direction) => {
    const target = direction === "up" ? index - 1 : index + 1;
    setEdit((current) => ({ ...current, images: moveItem(current.images || [], index, target) }));
  };

  return (
    <div className="admin-card gallery-manager">
      <div className="toolbar">
        <div>
          <h2>Gallery Album Manager</h2>
          <p className="admin-muted">Create unlimited albums and upload as many photos as required. Use arrows or Display Position to arrange them.</p>
        </div>
        <button className="btn" onClick={() => setEdit({ id: nextId(albums), title: "", description: "", cover: "", images: [], sortOrder: albums.length + 1 })}>+ Add Album</button>
      </div>

      <div className="album-grid-admin">
        {albums.map((album, index) => (
          <article className="album-admin-card" key={album.id}>
            <img src={mediaUrl(album.cover || album.images?.[0]?.src || album.images?.[0])} alt={album.title} />
            <div>
              <span className="cms-position-number">{index + 1}</span>
              <h3>{album.title}</h3>
              <p>{album.description}</p>
              <b>{album.images?.length || 0} Photos</b>
            </div>
            <div className="gallery-order-actions">
              <button className="cms-move-btn" onClick={() => moveAlbum(index, "up")} disabled={index === 0} title="Move album up">↑</button>
              <button className="cms-move-btn" onClick={() => moveAlbum(index, "down")} disabled={index === albums.length - 1} title="Move album down">↓</button>
              <button className="btn secondary" onClick={() => setView(album)}>View</button>
              <button className="btn secondary" onClick={() => setEdit({ ...album, sortOrder: index + 1 })}>Edit</button>
              <button className="btn danger" onClick={() => persist(albums.filter((a) => a.id !== album.id))}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      {view && (
        <div className="modal-bg" onMouseDown={(event) => { if (event.target === event.currentTarget) setView(null); }}>
          <div className="modal">
            <div className="toolbar"><h2>{view.title}</h2><button className="btn secondary" onClick={() => setView(null)}>Close</button></div>
            <p>{view.description}</p>
            <div className="album-photo-grid">
              {(view.images || []).map((img, index) => <img key={img.id || index} src={mediaUrl(img.src || img)} alt={`${view.title} ${index + 1}`} />)}
            </div>
          </div>
        </div>
      )}

      {edit && (
        <div className="modal-bg">
          <div className="modal">
            <div className="toolbar"><h2>{albums.some((album) => album.id === edit.id) ? `Edit Album #${edit.id}` : "Add Album"}</h2><button className="btn secondary" onClick={() => setEdit(null)}>Close</button></div>
            <div className="form-grid">
              <label>Album Name<input className="input" value={edit.title || ""} onChange={(event) => setEdit({ ...edit, title: event.target.value })} /></label>
              <label>Display Position<select className="select" value={edit.sortOrder || 1} onChange={(event) => setEdit({ ...edit, sortOrder: Number(event.target.value) })}>{Array.from({ length: albums.some((album) => album.id === edit.id) ? albums.length : albums.length + 1 }, (_, index) => <option key={index + 1} value={index + 1}>Position {index + 1}</option>)}</select></label>
              <label>Cover Image (Max 5MB)<input className="input" type="file" accept="image/*" onChange={setCover} disabled={uploading} /></label>
              <label style={{ gridColumn: "1/-1" }}>Description<textarea className="textarea" value={edit.description || ""} onChange={(event) => setEdit({ ...edit, description: event.target.value })} /></label>
              <label style={{ gridColumn: "1/-1" }}>Album Photos<input className="input" type="file" accept="image/*" multiple onChange={addImages} disabled={uploading} /><small>Select any number of photos. Every image must be 5MB or less.</small></label>
            </div>
            <div className="album-photo-grid editable">
              {(edit.images || []).map((img, index) => (
                <div className="photo-edit-card gallery-photo-item" key={img.id || index}>
                  <img src={mediaUrl(img.src || img)} alt="" />
                  <div className="gallery-photo-order">
                    <button type="button" onClick={() => movePhoto(index, "up")} disabled={index === 0}>↑</button>
                    <button type="button" onClick={() => movePhoto(index, "down")} disabled={index === (edit.images || []).length - 1}>↓</button>
                  </div>
                  <button className="btn danger" onClick={() => setEdit({ ...edit, images: edit.images.filter((_, imageIndex) => imageIndex !== index) })}>Remove</button>
                </div>
              ))}
            </div>
            <button className="btn" onClick={saveAlbum} disabled={uploading}>{uploading ? "Uploading..." : "Save Album"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
