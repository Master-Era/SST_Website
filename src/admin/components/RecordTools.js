import React, { useEffect, useRef, useState } from "react";
import { exportCSV, exportPrint } from "../utils/store";

function ToolIcon({ name }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const icons = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 21h16" /></>,
  };
  return <svg {...common}>{icons[name]}</svg>;
}

export default function RecordTools({ filters, setFilters, onSearch, onClear, rows, title, filename, totalLabel = "" }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, []);

  const runSearch = () => {
    onSearch();
    setOpen(null);
  };

  const download = (format) => {
    if (format === "pdf") exportPrint(title, rows, totalLabel);
    else exportCSV(filename, rows);
    setOpen(null);
  };

  return (
    <div className="record-icon-tools" ref={ref}>
      <button className="record-tool-btn" type="button" title="Search" onClick={() => setOpen(open === "search" ? null : "search")}>
        <ToolIcon name="search" />
      </button>
      <button className="record-tool-btn" type="button" title="Download" onClick={() => setOpen(open === "download" ? null : "download")}>
        <ToolIcon name="download" />
      </button>

      {open === "search" && (
        <div className="record-tool-pop search-pop">
          <strong>Search Records</strong>
          <input
            className="input"
            placeholder="Name, number, email"
            value={filters.q}
            onChange={(event) => setFilters({ ...filters, q: event.target.value })}
          />
          <label>From Date<input className="input" type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} /></label>
          <label>To Date<input className="input" type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} /></label>
          <div className="record-pop-actions">
            <button className="btn" type="button" onClick={runSearch}>Search</button>
            <button className="btn secondary" type="button" onClick={() => { onClear(); setOpen(null); }}>Clear</button>
          </div>
        </div>
      )}

      {open === "download" && (
        <div className="record-tool-pop download-pop">
          <strong>Download Result</strong>
          <p>{rows.length} records selected</p>
          <button className="btn" type="button" onClick={() => download("excel")}>Excel</button>
          <button className="btn secondary" type="button" onClick={() => download("pdf")}>PDF</button>
        </div>
      )}
    </div>
  );
}
