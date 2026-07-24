import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/api";
import RecordTools from "../components/RecordTools";
import { filterByDateName } from "../utils/store";

export default function Devotees() {
  const [rows, setRows] = useState([]);
  const [view, setView] = useState(null);
  const [filters, setFilters] = useState({ q: "", from: "", to: "" });
  const [applied, setApplied] = useState({ q: "", from: "", to: "" });
  const filteredRows = useMemo(() => filterByDateName(rows, applied.q, applied.from, applied.to), [rows, applied]);
  useEffect(() => { adminApi.list("devotees").then(setRows).catch(() => setRows([])); }, []);

  const setStatus = async (row, status) => {
    setRows(rows.map((item) => item.id === row.id ? { ...item, status } : item));
    await adminApi.update("devotees", row.id, { status });
  };
  const remove = async (row) => {
    if (!window.confirm(`Delete devotee record for ${row.name}?`)) return;
    await adminApi.remove("devotees", row.id);
    setRows(rows.filter((item) => item.id !== row.id));
  };
  return (
    <div className="admin-card devotee-admin-page">
      <div className="toolbar">
        <div><h2>Devotee Management</h2><p className="admin-muted">Clean devotee connection records with status.</p></div>
        <RecordTools
          filters={filters}
          setFilters={setFilters}
          onSearch={() => setApplied(filters)}
          onClear={() => { setFilters({ q: "", from: "", to: "" }); setApplied({ q: "", from: "", to: "" }); }}
          rows={filteredRows}
          allRows={rows}
          title="Devotee Management Report"
          filename="devotee-report.csv"
        />
      </div>
      <table className="table admin-list-table">
        <thead><tr><th>ID No</th><th>Image</th><th>Name</th><th>Contact</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{filteredRows.map((row) => (
          <tr key={row.id}>
            <td>#{row.id}</td><td>{row.photo_data ? <img className="thumb devotee-thumb" src={row.photo_data} alt={row.name} /> : "No Image"}</td><td><b>{row.name}</b><small>{row.city}</small></td><td>{row.phone}<br /><small>{row.email}</small></td><td>{row.created_at}</td>
            <td><select className="select compact" value={row.status || "Not connected"} onChange={(e) => setStatus(row, e.target.value)}><option>Connected</option><option>Not connected</option></select></td>
            <td><button className="btn secondary" onClick={() => setView(row)}>View</button> <button className="btn danger" onClick={() => remove(row)}>Delete</button></td>
          </tr>
        ))}</tbody>
      </table>
      {view && <div className="modal-bg" onMouseDown={(e) => { if (e.target.className === "modal-bg") setView(null); }}><div className="modal"><div className="toolbar"><h2>Devotee Details</h2><button className="btn secondary" onClick={() => setView(null)}>Close</button></div>{view.photo_data && <img className="record-photo" src={view.photo_data} alt={view.name} />}<div className="record-view-grid">{Object.entries(view).filter(([k]) => k !== "photo_data").map(([k, v]) => <div className="record-view-field" key={k}><span>{k.replaceAll("_", " ")}</span><b>{String(v ?? "-")}</b></div>)}</div></div></div>}
    </div>
  );
}
