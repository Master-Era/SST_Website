import React, { useState } from "react";
import { adminApi } from "../../services/api";
import { mediaUrl } from "../../services/content";
import { addLog, load, nextId, save } from "../utils/store";
import { defaultWebsiteData } from "../data/defaultData";

export default function GalleryEdit() {
  const [w, setW] = useState(load("website", defaultWebsiteData));
  const [edit, setEdit] = useState(null);
  const [view, setView] = useState(null);
  const albums = w.gallery?.albums || [];

  const persist = (nextAlbums) => {
    const next = { ...w, gallery: { ...(w.gallery || {}), albums: nextAlbums } };
    setW(next);
    save("website", next);
    addLog("Gallery updated");
  };

  const saveAlbum = () => {
    const exists = albums.some((a) => a.id === edit.id);
    persist(exists ? albums.map((a) => (a.id === edit.id ? edit : a)) : [edit, ...albums]);
    setEdit(null);
  };

  const uploadFile = async (file) => {
    try {
      const uploaded = await adminApi.upload(file);
      return uploaded.url || uploaded.image_url || uploaded.path;
    } catch {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }
  };

  const addImages = async (e) => {
    const files = [...(e.target.files || [])];
    const uploaded = await Promise.all(files.map(async (file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      src: await uploadFile(file),
    })));
    setEdit({ ...edit, images: [...(edit.images || []), ...uploaded] });
  };

  const setCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEdit({ ...edit, cover: await uploadFile(file) });
  };

  return (
    <div className="admin-card gallery-manager">
      <div className="toolbar">
        <div>
          <h2>Gallery Album Manager</h2>
          <p className="admin-muted">Album add karo, andar jetla photo joie etla upload/remove karo.</p>
        </div>
        <button className="btn" onClick={() => setEdit({ id: nextId(albums), title: "", description: "", cover: "", images: [] })}>+ Add Album</button>
      </div>

      <div className="album-grid-admin">
        {albums.map((album) => (
          <article className="album-admin-card" key={album.id}>
            <img src={mediaUrl(album.cover || album.images?.[0]?.src || album.images?.[0])} alt={album.title} />
            <div>
              <h3>{album.title}</h3>
              <p>{album.description}</p>
              <b>{album.images?.length || 0} Photos</b>
            </div>
            <div className="album-actions">
              <button className="btn secondary" onClick={() => setView(album)}>View</button>
              <button className="btn secondary" onClick={() => setEdit(album)}>Edit</button>
              <button className="btn danger" onClick={() => persist(albums.filter((a) => a.id !== album.id))}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      {view && (
        <div className="modal-bg" onMouseDown={(e) => { if (e.target.className === "modal-bg") setView(null); }}>
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
            <div className="toolbar"><h2>Edit Album #{edit.id}</h2><button className="btn secondary" onClick={() => setEdit(null)}>Close</button></div>
            <div className="form-grid">
              <label>Album Name<input className="input" value={edit.title || ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></label>
              <label>Cover Image<input className="input" type="file" accept="image/*" onChange={setCover} /></label>
              <label style={{ gridColumn: "1/-1" }}>Description<textarea className="textarea" value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></label>
              <label>Album Photos<input className="input" type="file" accept="image/*" multiple onChange={addImages} /></label>
            </div>
            <div className="album-photo-grid editable">
              {(edit.images || []).map((img, index) => (
                <div className="photo-edit-card" key={img.id || index}>
                  <img src={mediaUrl(img.src || img)} alt="" />
                  <button className="btn danger" onClick={() => setEdit({ ...edit, images: edit.images.filter((_, i) => i !== index) })}>Remove</button>
                </div>
              ))}
            </div>
            <button className="btn" onClick={saveAlbum}>Save Album</button>
          </div>
        </div>
      )}
    </div>
  );
}
