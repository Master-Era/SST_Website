import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../services/api";

const labels = {
  id: "ID Number",
  name: "Full Name",
  father_husband_name: "Father / Husband Name",
  phone: "Mobile Number",
  whatsapp: "WhatsApp Number",
  email: "Email",
  gender: "Gender",
  date_of_birth: "Date of Birth",
  age: "Age",
  address: "Address",
  city: "City / Village",
  state: "State",
  pincode: "Pincode",
  occupation: "Occupation",
  satsang_attend: "Attends Satsang Sabha",
  message: "Remarks / Message",
  status: "Connection Status",
  created_at: "Registration Date",
};

const normalizeStatus = (value) => {
  const status = String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ");

  if (
    status === "not connected" ||
    status === "notconnected"
  ) {
    return "Not Connected";
  }

  return "Connected";
};
const displayValue = (key, value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (key === "satsang_attend") return Number(value) === 1 || value === true ? "Yes" : "No";
  return String(value);
};

export default function DevoteeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.list("devotees")
      .then((rows) => {
        const found = rows.find((row) => String(row.id) === String(id));
        if (!found) throw new Error("Devotee record not found.");
        setRecord({ ...found, status: normalizeStatus(found.status) });
      })
      .catch((err) => setError(err.message || "Unable to load devotee details."))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    const safeStatus = normalizeStatus(status);
    const previous = record.status;
    setRecord({ ...record, status: safeStatus });
    try {
      await adminApi.update("devotees", record.id, { status: safeStatus });
    } catch (err) {
      setRecord({ ...record, status: previous });
      window.alert(err.message || "Status could not be updated.");
    }
  };

  if (loading) return <div className="admin-card"><p>Loading devotee details...</p></div>;
  if (error || !record) return <div className="admin-card"><h2>Devotee Details</h2><p className="admin-alert">{error}</p><button className="btn secondary" onClick={() => navigate("/admin/devotees")}>Back</button></div>;

  const hidden = new Set(["photo_data"]);

  return (
    <div className="devotee-detail-page">
      <div className="admin-card devotee-detail-head">
        <div>
          <button className="btn secondary" onClick={() => navigate("/admin/devotees")}>← Back to Devotees</button>
          <h2>Devotee Details</h2>
          <p className="admin-muted">Complete registration information and connection status.</p>
        </div>
        <div className="devotee-detail-actions">
          <label>
            Connection Status
            <select className="select" value={record.status} onChange={(e) => updateStatus(e.target.value)}>
              <option value="Connected">Connected</option>
              <option value="Not Connected">Not Connected</option>
            </select>
          </label>
          <button className="btn" type="button" onClick={() => window.print()}>Print Details</button>
        </div>
      </div>

      <div className="admin-card devotee-detail-card">
        <aside className="devotee-detail-photo-panel">
          {record.photo_data ? <img src={record.photo_data} alt={record.name} /> : <div className="devotee-no-photo">No Image</div>}
          <h3>{record.name}</h3>
          <span className={`devotee-status-badge ${record.status === "Connected" ? "connected" : "not-connected"}`}>{record.status}</span>
        </aside>
        <section className="devotee-detail-grid">
          {Object.entries(record)
            .filter(([key]) => !hidden.has(key))
            .map(([key, value]) => (
              <div className={`devotee-detail-field ${key === "address" || key === "message" ? "wide" : ""}`} key={key}>
                <span>{labels[key] || key.replaceAll("_", " ")}</span>
                <strong>{displayValue(key, value)}</strong>
              </div>
            ))}
        </section>
      </div>
    </div>
  );
}
