import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/api";
import RecordTools from "../components/RecordTools";
import { filterByDateName } from "../utils/store";

export default function Donations() {
  const [rows, setRows] = useState([]);
  const [view, setView] = useState(null);
  const [filters, setFilters] = useState({ q: "", from: "", to: "" });
  const [applied, setApplied] = useState({ q: "", from: "", to: "" });
  const filteredRows = useMemo(() => filterByDateName(rows, applied.q, applied.from, applied.to), [rows, applied]);
  const totalAmount = filteredRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  useEffect(() => { adminApi.list("donations").then(setRows).catch(() => setRows([])); }, []);

  const setStatus = async (row, status) => {
    const next = rows.map((item) => item.id === row.id ? { ...item, receipt_status: status, status } : item);
    setRows(next);
    await adminApi.update("donations", row.id, { receipt_status: status, status });
  };
  const remove = async (row) => {
    if (!window.confirm(`Delete donation request from ${row.name}?`)) return;
    await adminApi.remove("donations", row.id);
    setRows(rows.filter((item) => item.id !== row.id));
  };

  return (
    <div className="admin-card donation-page-admin">
      <div className="toolbar">
        <div><h2>Donation Management</h2><p className="admin-muted">Receipt status and donor request control.</p></div>
        <RecordTools
          filters={filters}
          setFilters={setFilters}
          onSearch={() => setApplied(filters)}
          onClear={() => { setFilters({ q: "", from: "", to: "" }); setApplied({ q: "", from: "", to: "" }); }}
          rows={filteredRows}
          title="Donation Management Report"
          filename="donation-report.csv"
          totalLabel={`Total Amount: Rs. ${totalAmount}`}
        />
      </div>
      <table className="table admin-list-table">
        <thead><tr><th>Sr</th><th>Name</th><th>Contact</th><th>Amount</th><th>Donation Purpose</th><th>Receipt Number</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{filteredRows.map((row, index) => (
          <tr key={row.id}>
            <td>{index + 1}</td><td><b>{row.name}</b></td><td>{row.phone}<br /><small>{row.email}</small></td><td>Rs. {row.amount}</td><td>{row.purpose || row.category}</td><td>{row.receipt_number || `SSTRec. No. ${String(index + 1).padStart(3, "0")}`}</td>
            <td><select className="select compact" value={row.receipt_status || "Receipt Pending"} onChange={(e) => setStatus(row, e.target.value)}><option>Receipt Pending</option><option>Receipt Done</option><option>Receipt Sent</option></select></td>
            <td><button className="btn secondary" onClick={() => setView(row)}>View</button> <button className="btn danger" onClick={() => remove(row)}>Delete</button></td>
          </tr>
        ))}</tbody>
      </table>
      {view && <div className="modal-bg" onMouseDown={(e) => { if (e.target.className === "modal-bg") setView(null); }}><div className="modal"><div className="toolbar"><h2>Donation Details</h2><button className="btn secondary" onClick={() => setView(null)}>Close</button></div><div className="record-view-grid">{Object.entries(view).map(([k, v]) => <div className="record-view-field" key={k}><span>{k.replaceAll("_", " ")}</span><b>{String(v ?? "-")}</b></div>)}</div></div></div>}
    </div>
  );
}
