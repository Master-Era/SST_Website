import React, { useState } from "react";
import { adminApi } from "../../services/api";
import { mediaUrl } from "../../services/content";
import { fileToDataUrl, nextId } from "../utils/store";

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
  const [rows, setRows] = useState(items || []);
  const [edit, setEdit] = useState(null);

  const blank = {
    id: nextId(rows),
    title: "",
    content: "",
    image: "",
    videoUrl: "",
    mediaType: "image",
    active: true,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const change = (key, value) => setEdit((current) => ({ ...current, [key]: value }));

  const saveRow = () => {
    const exists = rows.some((row) => row.id === edit.id);
    const output = exists ? rows.map((row) => (row.id === edit.id ? edit : row)) : [edit, ...rows];
    setRows(output);
    onSave(output);
    setEdit(null);
  };

  const deleteRow = (id) => {
    if (!window.confirm("Delete this item?")) return;
    const output = rows.filter((row) => row.id !== id);
    setRows(output);
    onSave(output);
  };

  const fileChange = async (event, key = "image") => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (key === "pdfData") {
      const data = await fileToDataUrl(file);
      change(key, data);
      change("pdfName", file.name);
      return;
    }

    const targetKey = allowVideoUpload && file.type.startsWith("video/") ? "videoUrl" : key;
    try {
      const uploaded = await adminApi.upload(file);
      change(targetKey, uploaded.url || uploaded.image_url || uploaded.path);
      if (allowVideoUpload) {
        change("mediaType", targetKey === "videoUrl" ? "video" : "image");
        if (targetKey === "videoUrl") change("image", edit.image || "");
        else change("videoUrl", "");
      }
    } catch {
      const data = await fileToDataUrl(file);
      change(targetKey, data);
      if (allowVideoUpload) change("mediaType", targetKey === "videoUrl" ? "video" : "image");
    }
  };

  const editorForm = edit && (
    <>
      <div className="toolbar cms-modal-head">
        <div>
          <h2>{edit.id ? `Edit #${edit.id}` : "Add"}</h2>
          <p className="admin-muted">{title}</p>
        </div>
        <button className="btn secondary" type="button" onClick={() => setEdit(null)}>Close</button>
      </div>

      <div className="cms-modal-body">
        <div className="form-grid cms-form-grid">
          {fields.includes("title") && (
            <label className="cms-field">
              Title
              <input className="input" value={edit.title || ""} onChange={(event) => change("title", event.target.value)} />
            </label>
          )}
          {fields.includes("name") && (
            <label className="cms-field">
              Name
              <input className="input" value={edit.name || ""} onChange={(event) => change("name", event.target.value)} />
            </label>
          )}
          {fields.includes("year") && (
            <label className="cms-field">
              Year
              <input className="input" value={edit.year || ""} onChange={(event) => change("year", event.target.value)} />
            </label>
          )}
          {fields.includes("date") && (
            <label className="cms-field">
              Date
              <input type="date" className="input" value={edit.date || edit.createdAt || ""} onChange={(event) => change("date", event.target.value)} />
            </label>
          )}
          {!hideImage && (
            <label className="cms-field">
              {imageLabel}
              <input type="file" className="input" accept={allowVideoUpload ? "image/*,video/mp4,video/webm,video/ogg" : "image/*"} onChange={fileChange} />
              {allowVideoUpload && <small>Upload JPG/PNG poster or MP4/WebM video clip.</small>}
              {edit.videoUrl ? <video className="thumb cms-preview-thumb" src={mediaUrl(edit.videoUrl)} controls muted /> : edit.image && <img className="thumb cms-preview-thumb" src={mediaUrl(edit.image)} alt="preview" />}
            </label>
          )}
          {allowVideo && (
            <label className="cms-field">
              Video Link
              <input className="input" value={edit.videoUrl || ""} placeholder="Optional direct MP4/WebM video link" onChange={(event) => { change("videoUrl", event.target.value); if (event.target.value) change("mediaType", "video"); }} />
            </label>
          )}
          {allowPdf && (
            <label className="cms-field">
              PDF Upload
              <input type="file" className="input" accept="application/pdf" onChange={(event) => fileChange(event, "pdfData")} />
              <small>{edit.pdfName}</small>
            </label>
          )}
          <label className="cms-field">
            Status
            <select className="select" value={edit.active !== false ? "Active" : "Hide"} onChange={(event) => change("active", event.target.value === "Active")}>
              <option>Active</option>
              <option>Hide</option>
            </select>
          </label>
          <label className="cms-field cms-content-field">
            Content
            <textarea className="textarea" value={edit.content || ""} onChange={(event) => change("content", event.target.value)} />
          </label>
        </div>
      </div>

      <div className="cms-modal-footer">
        <button className="btn secondary" type="button" onClick={() => setEdit(null)}>Cancel</button>
        <button className="btn" type="button" onClick={saveRow}>Save Changes</button>
      </div>
    </>
  );

  return (
    <div className="admin-card cms-editor-card">
      <div className="toolbar">
        <h2>{title}</h2>
        <button className="btn" type="button" onClick={() => setEdit(blank)}>+ Add New</button>
      </div>

      {edit && inlineEditor && (
        <div className="cms-inline-editor">
          {editorForm}
        </div>
      )}

      <table className="table cms-table">
        <thead>
          <tr>
            <th>ID</th>
            {!hideImage && <th>Image</th>}
            <th>Title</th>
            <th>Content</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>#{row.id}</td>
              {!hideImage && (
                <td>
                  {row.videoUrl ? <video className="thumb" src={mediaUrl(row.videoUrl)} muted /> : row.image ? <img className="thumb" src={mediaUrl(row.image)} alt="" /> : <span className="badge">No media</span>}
                </td>
              )}
              <td>{row.title || row.name || "-"}</td>
              <td>{String(row.content || "").slice(0, 80)}{row.content ? "..." : ""}</td>
              <td><span className="badge">{row.active !== false ? "Active" : "Hide"}</span></td>
              <td>
                <button className="btn secondary" type="button" onClick={() => setEdit(row)}>Edit</button>{" "}
                <button className="btn danger" type="button" onClick={() => deleteRow(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {edit && !inlineEditor && (
        <div className="modal-bg cms-modal-bg" onMouseDown={(event) => { if (event.target === event.currentTarget) setEdit(null); }}>
          <div className="modal cms-edit-modal">{editorForm}</div>
        </div>
      )}
    </div>
  );
}
