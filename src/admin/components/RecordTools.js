import React, { useEffect, useMemo, useRef, useState } from "react";
import { exportCSV, exportExcelWithImages, exportPrint } from "../utils/store";

function Icon({ name }) {
  const common = { width: 19, height: 19, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function RecordTools({ filters, setFilters, onSearch, onClear, rows, allRows = [], title, filename, totalLabel = "", includeImages = false }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selectedNameCount = useMemo(() => {
    const q = String(filters.q || "").trim().toLowerCase();
    if (!q) return 0;
    return allRows.filter((row) => String(row.name || "").toLowerCase().includes(q)).length;
  }, [allRows, filters.q]);

  const apply = () => { onSearch(); setOpen(null); };
  const download = (format) => {
    if (format === "pdf") exportPrint(title, rows, totalLabel);
    else if (includeImages) exportExcelWithImages(filename, rows, title);
    else exportCSV(filename, rows);
    setOpen(null);
  };

  return (
    <div className="record-icon-tools" ref={ref}>
      <button className="record-tool-btn" type="button" onClick={() => setOpen(open === "search" ? null : "search")}><Icon name="search"/><span>Search & Filter</span></button>
      <button className="record-tool-btn primary" type="button" onClick={() => setOpen(open === "download" ? null : "download")}><Icon name="download"/><span>Download</span></button>

      {open === "search" && (
        <div className="record-tool-pop professional-filter-pop">
          <div className="record-pop-head"><div><strong>Search Records</strong><small>Filter by name, contact or submission date</small></div><button type="button" onClick={() => setOpen(null)}><Icon name="close"/></button></div>
          <label>Search name / mobile / email<input className="input" placeholder="Example: Sachin or 98765..." value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })}/></label>
          <div className="record-date-grid">
            <label>From date<input className="input" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })}/></label>
            <label>To date<input className="input" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })}/></label>
          </div>
          {filters.q && <div className="name-frequency"><b>{selectedNameCount}</b><span>matching application(s) for this name/search in all records</span></div>}
          <div className="record-pop-actions"><button className="btn" type="button" onClick={apply}>Apply Filter</button><button className="btn secondary" type="button" onClick={() => { onClear(); setOpen(null); }}>Reset</button></div>
        </div>
      )}

      {open === "download" && (
        <div className="record-tool-pop professional-download-pop">
          <div className="record-pop-head"><div><strong>Download Filtered Data</strong><small>Current search and date filters will be applied</small></div><button type="button" onClick={() => setOpen(null)}><Icon name="close"/></button></div>
          <div className="download-count"><b>{rows.length}</b><span>record(s) ready</span></div>
          {totalLabel && <p className="download-total">{totalLabel}</p>}
          <button className="btn" type="button" onClick={() => download("excel")}>Download Excel with Images</button>
          <button className="btn secondary" type="button" onClick={() => download("pdf")}>Download PDF / Print</button>
        </div>
      )}
    </div>
  );
}
