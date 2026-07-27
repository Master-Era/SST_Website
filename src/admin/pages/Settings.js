import React, { useState } from "react";
import { load, save, fileToDataUrl, addLog, validateAdminImage } from "../utils/store";
import { defaultSettings } from "../data/defaultData";

export default function Settings() {
  const [settings, setSettings] = useState(load("settings", defaultSettings));
  const change = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const uploadQr = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validation = validateAdminImage(file);
    if (!validation.ok) {
      window.alert(validation.message);
      event.target.value = "";
      return;
    }
    change("upiQr", await fileToDataUrl(file));
    event.target.value = "";
  };

  const submit = () => {
    save("settings", settings);
    addLog("Settings updated");
    window.alert("Settings saved");
  };

  return (
    <div className="admin-card">
      <h2>Email Notification & Donation Configuration</h2>
      <div className="form-grid">
        <label>Notification Emails (2-3 emails comma separated)<input className="input" value={settings.notificationEmails} onChange={(e) => change("notificationEmails", e.target.value)} /></label>
        <label>Email Notification<select className="select" value={settings.emailNotifications ? "Yes" : "No"} onChange={(e) => change("emailNotifications", e.target.value === "Yes")}><option>Yes</option><option>No</option></select></label>
        <label>Bank Name<input className="input" value={settings.bankName} onChange={(e) => change("bankName", e.target.value)} /></label>
        <label>Account Name<input className="input" value={settings.accountName} onChange={(e) => change("accountName", e.target.value)} /></label>
        <label>Account No<input className="input" value={settings.accountNo} onChange={(e) => change("accountNo", e.target.value)} /></label>
        <label>IFSC<input className="input" value={settings.ifsc} onChange={(e) => change("ifsc", e.target.value)} /></label>
        <label>UPI ID<input className="input" value={settings.upiId} onChange={(e) => change("upiId", e.target.value)} /></label>
        <label>UPI QR Image (Max 5MB)<input className="input" type="file" accept="image/*" onChange={uploadQr} />{settings.upiQr && <img className="thumb" src={settings.upiQr} alt="QR" />}</label>
      </div>
      <button className="btn" onClick={submit}>Save Configuration</button>
      <p><b>Note:</b> Real email notification mate backend SMTP ma aa emails use karvana che. Frontend demo ma notification dashboard ma add thay che.</p>
    </div>
  );
}
