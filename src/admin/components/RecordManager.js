import React, { useMemo, useState } from "react";
import { adminApi } from "../../services/api";
import { exportCSV, exportPrint, filterByDateName } from "../utils/store";

const labels = {
  id: "ID",
  name: "Name",
  phone: "Mobile Number",
  email: "Email",
  subject: "Subject",
  message: "Message",
  type: "Type",
  category: "Category",
  amount: "Amount",
  city: "City",
  age: "Age",
  family_members: "Family Members",
  status: "Status",
  receipt_status: "Receipt Status",
  created_at: "Submitted Date",
  createdAt: "Submitted Date",
};

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function RecordManager({ title, rows, setRows, type = "inquiries", totalAmount = false }) {
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [panel, setPanel] = useState(null);
  const [view, setView] = useState(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => filterByDateName(rows, query, from, to), [rows, query, from, to]);
  const total = filtered.reduce((s, r) => s + Number(r.amount || 0), 0);

  const removeRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await adminApi.remove(type, id);
    setRows(rows.filter((r) => r.id !== id));
    setMessage("Record deleted.");
  };

  const status = async (id, value) => {
    const updated = rows.map((r) => (r.id === id ? { ...r, status: value, receipt_status: value } : r));
    setRows(updated);
    await adminApi.update(type, id, { status: value, receipt_status: value });
    setMessage("Status updated.");
  };

  const clearPanel = () => {
    setPanel(null);
    setQuery("");
    setFrom("");
    setTo("");
  };

  return (
    <div className="admin-card">
      <div className="toolbar">
        <div>
          <h2>{title}</h2>
          <p className="admin-muted">Visitor submitted records from live website.</p>
        </div>
        <div>
          <button className="btn secondary" onClick={() => setPanel(panel === "search" ? null : "search")}>Search</button>{" "}
          <button className="btn secondary" onClick={() => setPanel(panel === "download" ? null : "download")}>Download</button>
        </div>
      </div>

      {message && <div className="admin-alert" onAnimationEnd={() => setMessage("")}>{message}</div>}

      {panel && (
        <div className="filter-panel">
          <input className="input" placeholder="Search name, phone, email" value={query} onChange={(e) => setQuery(e.target.value)} />
          <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          {panel === "download" && (
            <>
              <button className="btn" onClick={() => exportCSV(`${type}-data.csv`, filtered)}>Excel/CSV</button>
              <button className="btn" onClick={() => exportPrint(title, filtered, totalAmount ? `Total Amount: Rs. ${total}` : "")}>PDF / Print</button>
            </>
          )}
          <button className="btn secondary" onClick={clearPanel}>Clear</button>
        </div>
      )}

      {totalAmount && <h3>Total Amount: Rs. {total}</h3>}

      <table className="table record-table">
        <thead>
          <tr>
            <th>Sr</th>
            <th>Name</th>
            <th>Contact</th>
            {type === "devotees" && <th>Image</th>}
            {totalAmount && <th>Amount</th>}
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={r.id}>
              <td>{i + 1}</td>
              <td>{r.name}<br /><small>{r.subject || r.category || r.city || ""}</small></td>
              <td>{r.phone}<br /><small>{r.email}</small></td>
              {type === "devotees" && <td>{r.image || r.photo_data ? <img className="thumb" src={r.image || r.photo_data} alt="devotee" /> : "No Image"}</td>}
              {totalAmount && <td>Rs. {r.amount}</td>}
              <td>
                <select className="select compact" value={r.status || r.receipt_status || "New"} onChange={(e) => status(r.id, e.target.value)}>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Receipt Done</option>
                </select>
              </td>
              <td>{r.created_at || r.createdAt || "-"}</td>
              <td>
                <button className="btn secondary" onClick={() => setView(r)}>View</button>{" "}
                <button className="btn danger" onClick={() => removeRecord(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {view && (
        <div className="modal-bg" onMouseDown={(e) => { if (e.target.className === "modal-bg") setView(null); }}>
          <div className="modal">
            <div className="toolbar">
              <h2>{title} Form View</h2>
              <button className="btn secondary" onClick={() => setView(null)}>Close</button>
            </div>
            {(view.image || view.photo_data) && <img className="record-photo" src={view.image || view.photo_data} alt="record" />}
            <div className="record-view-grid">
              {Object.entries(view)
                .filter(([key]) => !["image", "photo_data"].includes(key))
                .map(([key, value]) => (
                  <div className="record-view-field" key={key}>
                    <span>{labels[key] || key.replaceAll("_", " ")}</span>
                    <b>{formatValue(value)}</b>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
