import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/api";
import { mediaUrl } from "../../services/content";
import { fileToDataUrl, nextId, validateAdminImage } from "../utils/store";

const normalizeOrder = (list = []) =>
  list.map((item, index) => ({ ...item, sortOrder: index + 1 }));

const moveInArray = (list, fromIndex, toIndex) => {
  const output = [...list];
  const [item] = output.splice(fromIndex, 1);
  output.splice(toIndex, 0, item);
  return normalizeOrder(output);
};

export default function CmsEditor({
  title,
  items,
  onSave,
  fields = ["title", "content"],
  imageLabel = "Image",
  allowPdf = false,
  allowVideo = false,
  allowVideoUpload = false,
  hideImage = false,
  inlineEditor = false,
}) {
  const [rows, setRows] = useState(() => normalizeOrder(items || []));
  const [edit, setEdit] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setRows(normalizeOrder(items || []));
  }, [items]);

  const blank = useMemo(() => ({
    id: nextId(rows),
    title: "",
    content: "",
    image: "",
    videoUrl: "",
    mediaType: "image",
    active: true,
    sortOrder: rows.length + 1,
    createdAt: new Date().toISOString().slice(0, 10),
  }), [rows]);

  const change = (key, value) =>
    setEdit((current) => ({ ...current, [key]: value }));

  const persistRows = (nextRows) => {
    const normalized = normalizeOrder(nextRows);
    setRows(normalized);
    onSave(normalized);
  };

  const saveRow = () => {
    if (!edit) return;

    const exists = rows.some((row) => row.id === edit.id);
    const requestedPosition = Math.min(
      Math.max(Number(edit.sortOrder) || rows.length + 1, 1),
      exists ? rows.length : rows.length + 1
    );

    const withoutCurrent = rows.filter((row) => row.id !== edit.id);
    withoutCurrent.splice(requestedPosition - 1, 0, {
      ...edit,
      sortOrder: requestedPosition,
    });

    persistRows(withoutCurrent);
    setEdit(null);
  };

  const deleteRow = (id) => {
    if (!window.confirm("Delete this item?")) return;
    persistRows(rows.filter((row) => row.id !== id));
  };

  const moveRow = (id, direction) => {
    const fromIndex = rows.findIndex((row) => row.id === id);
    if (fromIndex < 0) return;
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= rows.length) return;
    persistRows(moveInArray(rows, fromIndex, toIndex));
  };

  const fileChange = async (event, key = "image") => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (key !== "pdfData" && file.type.startsWith("image/")) {
      const validation = validateAdminImage(file);
      if (!validation.ok) {
        window.alert(validation.message);
        event.target.value = "";
        return;
      }
    }

    if (key === "pdfData") {
      const data = await fileToDataUrl(file);
      change(key, data);
      change("pdfName", file.name);
      return;
    }

    const targetKey =
      allowVideoUpload && file.type.startsWith("video/") ? "videoUrl" : key;

    setUploading(true);
    try {
      const uploaded = await adminApi.upload(file);
      change(targetKey, uploaded.url || uploaded.image_url || uploaded.path);
      if (allowVideoUpload) {
        change("mediaType", targetKey === "videoUrl" ? "video" : "image");
        if (targetKey === "videoUrl") change("image", edit?.image || "");
        else change("videoUrl", "");
      }
    } catch (error) {
      /*
        IMPORTANT: previously this silently embedded the raw image as a
        giant base64 string directly into the database on upload failure.
        That bloated some rows to several MB, which is what caused the
        public content API to crash with a MySQL "Out of sort memory"
        error. Never do that again - show the real error instead so the
        admin can retry the upload.
      */
      window.alert(
        `Image upload failed: ${error?.message || "Please check your connection and try again."}`
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const editorForm = edit && (
    <>
      <div className="toolbar cms-modal-head">
        <div>
          <h2>{rows.some((row) => row.id === edit.id) ? `Edit #${edit.id}` : "Add New"}</h2>
          <p className="admin-muted">{title}</p>
        </div>
        <button className="btn secondary" type="button" onClick={() => setEdit(null)}>Close</button>
      </div>

      <div className="cms-modal-body">
        <div className="form-grid cms-form-grid">
          {fields.includes("title") && (
            <label className="cms-field">Title
              <input className="input" value={edit.title || ""} onChange={(event) => change("title", event.target.value)} />
            </label>
          )}
          {fields.includes("name") && (
            <label className="cms-field">Name
              <input className="input" value={edit.name || ""} onChange={(event) => change("name", event.target.value)} />
            </label>
          )}
          {fields.includes("year") && (
            <label className="cms-field">Year
              <input className="input" value={edit.year || ""} onChange={(event) => change("year", event.target.value)} />
            </label>
          )}
          {fields.includes("date") && (
            <label className="cms-field">Date
              <input type="date" className="input" value={edit.date || edit.createdAt || ""} onChange={(event) => change("date", event.target.value)} />
            </label>
          )}

          <label className="cms-field">Display Position
            <select className="select" value={edit.sortOrder || 1} onChange={(event) => change("sortOrder", Number(event.target.value))}>
              {Array.from({ length: rows.some((row) => row.id === edit.id) ? rows.length : rows.length + 1 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  Position {index + 1}{index === 0 ? " - First" : index === rows.length ? " - Last" : ""}
                </option>
              ))}
            </select>
            <small>Select exactly where this card should appear.</small>
          </label>

          {!hideImage && (
            <label className="cms-field">{imageLabel}
              <input type="file" className="input" accept={allowVideoUpload ? "image/*,video/*" : "image/*"} onChange={fileChange} disabled={uploading} />
              <small>{uploading ? "Uploading media..." : "Images up to 5MB are allowed. Upload items one by one here."}</small>
              {edit.videoUrl ? <video className="thumb cms-preview-thumb" src={mediaUrl(edit.videoUrl)} controls muted /> : edit.image && <img className="thumb cms-preview-thumb" src={mediaUrl(edit.image)} alt="preview" />}
            </label>
          )}
          {allowVideo && (
            <label className="cms-field">Video Link
              <input className="input" value={edit.videoUrl || ""} placeholder="Optional direct video link" onChange={(event) => { change("videoUrl", event.target.value); if (event.target.value) change("mediaType", "video"); }} />
            </label>
          )}
          {allowPdf && (
            <label className="cms-field">PDF Upload
              <input type="file" className="input" accept="application/pdf" onChange={(event) => fileChange(event, "pdfData")} />
              <small>{edit.pdfName}</small>
            </label>
          )}
          <label className="cms-field">Status
            <select className="select" value={edit.active !== false ? "Active" : "Hide"} onChange={(event) => change("active", event.target.value === "Active")}>
              <option>Active</option><option>Hide</option>
            </select>
          </label>
          <label className="cms-field cms-content-field">Content
            <textarea className="textarea" value={edit.content || ""} onChange={(event) => change("content", event.target.value)} />
          </label>
        </div>
      </div>

      <div className="cms-modal-footer">
        <button className="btn secondary" type="button" onClick={() => setEdit(null)}>Cancel</button>
        <button className="btn" type="button" onClick={saveRow} disabled={uploading}>{uploading ? "Uploading..." : "Save Changes"}</button>
      </div>
    </>
  );

  return (
    <div className="admin-card cms-editor-card">
      <div className="toolbar">
        <h2>{title}</h2>
        <button className="btn" type="button" onClick={() => setEdit(blank)}>+ Add New</button>
      </div>

      {edit && inlineEditor && <div className="cms-inline-editor">{editorForm}</div>}

      <div className="cms-table-scroll">
        <table className="table cms-table">
          <thead><tr><th>Position</th><th>ID</th>{!hideImage && <th>Image</th>}<th>Title</th><th>Content</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td><span className="cms-position-number">{index + 1}</span></td>
                <td>#{row.id}</td>
                {!hideImage && <td>{row.videoUrl ? <video className="thumb" src={mediaUrl(row.videoUrl)} muted /> : row.image ? <img className="thumb" src={mediaUrl(row.image)} alt="" /> : <span className="badge">No media</span>}</td>}
                <td>{row.title || row.name || "-"}</td>
                <td>{String(row.content || "").slice(0, 80)}{row.content ? "..." : ""}</td>
                <td><span className="badge">{row.active !== false ? "Active" : "Hide"}</span></td>
                <td>
                  <div className="cms-row-actions">
                    <button className="cms-move-btn" type="button" onClick={() => moveRow(row.id, "up")} disabled={index === 0} title="Move up">↑</button>
                    <button className="cms-move-btn" type="button" onClick={() => moveRow(row.id, "down")} disabled={index === rows.length - 1} title="Move down">↓</button>
                    <button className="btn secondary" type="button" onClick={() => setEdit({ ...row, sortOrder: index + 1 })}>Edit</button>
                    <button className="btn danger" type="button" onClick={() => deleteRow(row.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && !inlineEditor && (
        <div className="modal-bg cms-modal-bg" onMouseDown={(event) => { if (event.target === event.currentTarget) setEdit(null); }}>
          <div className="modal cms-edit-modal">{editorForm}</div>
        </div>
      )}
    </div>
  );
}
