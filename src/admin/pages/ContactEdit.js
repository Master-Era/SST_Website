import React, { useState } from "react";
import { load, save, addLog } from "../utils/store";
import { defaultWebsiteData } from "../data/defaultData";

export default function ContactEdit() {
  const [w, setW] = useState(load("website", defaultWebsiteData));
  const c = w.contact || {};

  const update = (key, value) => {
    setW((current) => ({ ...current, contact: { ...current.contact, [key]: value } }));
  };

  const submit = () => {
    save("website", w);
    addLog("Contact info updated");
    window.alert("Contact details saved. This updates the Contact page and the website footer.");
  };

  return (
    <div className="admin-card">
      <h2>Contact Details</h2>
      <p>This information is shown on the Contact page and in the website footer on every page.</p>
      <div className="form-grid">
        <label>
          Phone
          <input className="input" value={c.phone || ""} onChange={(e) => update("phone", e.target.value)} />
        </label>
        <label>
          WhatsApp Number
          <input className="input" value={c.whatsapp || ""} onChange={(e) => update("whatsapp", e.target.value)} />
        </label>
        <label>
          Email
          <input className="input" value={c.email || ""} onChange={(e) => update("email", e.target.value)} />
        </label>
        <label className="full-span">
          Address
          <textarea className="input" rows="3" value={c.address || ""} onChange={(e) => update("address", e.target.value)} />
        </label>
        <label className="full-span">
          Google Map Link
          <input className="input" value={c.mapLink || ""} onChange={(e) => update("mapLink", e.target.value)} />
        </label>
        <label>
          Darshan Time (Morning)
          <input className="input" value={c.darshanMorning || ""} onChange={(e) => update("darshanMorning", e.target.value)} />
        </label>
        <label>
          Darshan Time (Evening)
          <input className="input" value={c.darshanEvening || ""} onChange={(e) => update("darshanEvening", e.target.value)} />
        </label>
        <label>
          Facebook URL
          <input className="input" value={c.facebook || ""} onChange={(e) => update("facebook", e.target.value)} />
        </label>
        <label>
          Instagram URL
          <input className="input" value={c.instagram || ""} onChange={(e) => update("instagram", e.target.value)} />
        </label>
        <label>
          YouTube URL
          <input className="input" value={c.youtube || ""} onChange={(e) => update("youtube", e.target.value)} />
        </label>
      </div>
      <button className="btn" onClick={submit}>Save Contact Details</button>
    </div>
  );
}
