import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/api";
import RecordTools from "../components/RecordTools";
import { filterByDateName } from "../utils/store";

export default function Inquiries() {
  const [rows, setRows] = useState([]);
  const [view, setView] = useState(null);
  const [answers, setAnswers] = useState({});
  const [filters, setFilters] = useState({ q: "", from: "", to: "" });
  const [applied, setApplied] = useState({ q: "", from: "", to: "" });
  const filteredRows = useMemo(() => filterByDateName(rows, applied.q, applied.from, applied.to), [rows, applied]);

  useEffect(() => { adminApi.list("inquiries").then(setRows).catch(() => setRows([])); }, []);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("admin_inquiry_answers") || "{}");
    setAnswers(saved);
  }, []);

  const remove = async (row) => {
    if (!window.confirm(`Delete inquiry from ${row.name}?`)) return;
    await adminApi.remove("inquiries", row.id);
    setRows(rows.filter((item) => item.id !== row.id));
  };
  const saveAnswer = async (row) => {
    const next = { ...answers, [row.id]: answers[row.id] || "Answered / follow-up done" };
    setAnswers(next);
    localStorage.setItem("admin_inquiry_answers", JSON.stringify(next));
    const nextRows = rows.map((item) => item.id === row.id ? { ...item, status: "contacted" } : item);
    setRows(nextRows);
    await adminApi.update("inquiries", row.id, { status: "contacted" });
  };

  return (
    <div className="admin-card inquiry-page">
      <div className="toolbar">
        <div><h2>Inquiry Management</h2><p className="admin-muted">Contact form submissions with answer action tracking.</p></div>
        <RecordTools
          filters={filters}
          setFilters={setFilters}
          onSearch={() => setApplied(filters)}
          onClear={() => { setFilters({ q: "", from: "", to: "" }); setApplied({ q: "", from: "", to: "" }); }}
          rows={filteredRows}
          title="Inquiry Management Report"
          filename="inquiry-report.csv"
        />
      </div>
      <table className="table admin-list-table">
        <thead><tr><th>Sr.</th><th>Name</th><th>Contact Details</th><th>Date & Time</th><th>Action</th><th>Answer / Work Done</th></tr></thead>
        <tbody>{filteredRows.map((row, index) => (
          <tr key={row.id}>
            <td>{index + 1}</td>
            <td><b>{row.name}</b><small>{row.subject || row.type}</small></td>
            <td>Mobile: {row.phone || "-"}<br />WP: {row.whatsapp || "-"}<br />Email: {row.email || "-"}</td>
            <td>{row.created_at || "-"}</td>
            <td><button className="btn secondary" onClick={() => setView(row)}>View</button> <button className="btn danger" onClick={() => remove(row)}>Delete</button></td>
            <td><textarea className="mini-textarea" value={answers[row.id] || ""} onChange={(e) => setAnswers({ ...answers, [row.id]: e.target.value })} placeholder="Answer / follow-up note" /><button className="btn secondary" onClick={() => saveAnswer(row)}>Save Reply</button></td>
          </tr>
        ))}</tbody>
      </table>
      {view && <div className="modal-bg" onMouseDown={(e) => { if (e.target.className === "modal-bg") setView(null); }}><div className="modal"><div className="toolbar"><h2>Inquiry Details</h2><button className="btn secondary" onClick={() => setView(null)}>Close</button></div><div className="record-view-grid">{Object.entries(view).map(([k, v]) => <div className="record-view-field" key={k}><span>{k.replaceAll("_", " ")}</span><b>{String(v ?? "-")}</b></div>)}</div></div></div>}
    </div>
  );
}
