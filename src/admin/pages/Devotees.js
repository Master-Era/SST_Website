import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { adminApi } from "../../services/api";
import RecordTools from "../components/RecordTools";
import { filterByDateName } from "../utils/store";

const CONNECTED = "Connected";
const NOT_CONNECTED = "Not Connected";

const normalizeStatus = (value) =>
  String(value || "").trim().toLowerCase() === "not connected"
    ? NOT_CONNECTED
    : CONNECTED;

const getPhoto = (row = {}) =>
  row.photo_data || row.photo || row.image || row.image_url || row.profile_image || "";

const formatLabel = (key) =>
  String(key)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function Devotees() {
  const [rows, setRows] = useState([]);
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ q: "", from: "", to: "" });
  const [applied, setApplied] = useState({ q: "", from: "", to: "" });

  const filteredRows = useMemo(
    () => filterByDateName(rows, applied.q, applied.from, applied.to),
    [rows, applied]
  );

  const loadRows = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.list("devotees");
      const normalized = (Array.isArray(data) ? data : []).map((row) => ({
        ...row,
        status: normalizeStatus(row.status),
      }));
      setRows(normalized);
    } catch (loadError) {
      console.error(loadError);
      setRows([]);
      setError(loadError.message || "Unable to load devotee records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  useEffect(() => {
    if (!view) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setView(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [view]);

  const setStatus = async (row, nextValue) => {
    const status = normalizeStatus(nextValue);
    const previousStatus = normalizeStatus(row.status);

    setRows((current) =>
      current.map((item) => (item.id === row.id ? { ...item, status } : item))
    );
    setView((current) =>
      current?.id === row.id ? { ...current, status } : current
    );

    try {
      await adminApi.update("devotees", row.id, { status });
    } catch (updateError) {
      setRows((current) =>
        current.map((item) =>
          item.id === row.id ? { ...item, status: previousStatus } : item
        )
      );
      setView((current) =>
        current?.id === row.id
          ? { ...current, status: previousStatus }
          : current
      );
      window.alert(updateError.message || "Status could not be updated.");
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete devotee record for ${row.name}?`)) return;

    try {
      await adminApi.remove("devotees", row.id);
      setRows((current) => current.filter((item) => item.id !== row.id));
      if (view?.id === row.id) setView(null);
    } catch (removeError) {
      window.alert(removeError.message || "Record could not be deleted.");
    }
  };

  const modal = view
    ? createPortal(
        <div
          className="devotee-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setView(null);
          }}
        >
          <section
            className="devotee-modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="devotee-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="devotee-modal-header">
              <div>
                <span className="devotee-modal-label">Devotee Registration</span>
                <h2 id="devotee-detail-title">Devotee Details</h2>
              </div>
              <button
                type="button"
                className="devotee-modal-close"
                onClick={() => setView(null)}
                aria-label="Close devotee details"
              >
                ×
              </button>
            </header>

            <div className="devotee-modal-body">
              <div className="devotee-profile-section">
                {getPhoto(view) ? (
                  <img
                    className="devotee-modal-photo"
                    src={getPhoto(view)}
                    alt={view.name || "Devotee"}
                  />
                ) : (
                  <div className="devotee-modal-photo no-image">No Image</div>
                )}

                <div className="devotee-profile-copy">
                  <h3>{view.name || "-"}</h3>
                  <p>{[view.city, view.state].filter(Boolean).join(", ") || "-"}</p>
                  <span
                    className={`devotee-status-badge ${
                      normalizeStatus(view.status) === NOT_CONNECTED
                        ? "not-connected"
                        : "connected"
                    }`}
                  >
                    {normalizeStatus(view.status)}
                  </span>
                </div>
              </div>

              <div className="devotee-detail-grid">
                {Object.entries(view)
                  .filter(
                    ([key]) =>
                      ![
                        "photo_data",
                        "photo",
                        "image",
                        "image_url",
                        "profile_image",
                      ].includes(key)
                  )
                  .map(([key, value]) => (
                    <div
                      className={`devotee-detail-item ${
                        /address|message|remark|note/i.test(key)
                          ? "full-width"
                          : ""
                      }`}
                      key={key}
                    >
                      <span>{formatLabel(key)}</span>
                      <strong>
                        {value === null || value === undefined || value === ""
                          ? "-"
                          : key === "status"
                          ? normalizeStatus(value)
                          : String(value)}
                      </strong>
                    </div>
                  ))}
              </div>
            </div>

            <footer className="devotee-modal-footer">
              <button
                type="button"
                className="btn secondary"
                onClick={() => setView(null)}
              >
                Cancel
              </button>
            </footer>
          </section>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="admin-card devotee-admin-page">
      <div className="toolbar">
        <div>
          <h2>Devotee Management</h2>
          <p className="admin-muted">Manage real devotee records and connection status.</p>
        </div>

        <RecordTools
          filters={filters}
          setFilters={setFilters}
          onSearch={() => setApplied(filters)}
          onClear={() => {
            setFilters({ q: "", from: "", to: "" });
            setApplied({ q: "", from: "", to: "" });
          }}
          rows={filteredRows}
          allRows={rows}
          title="Devotee Management Report"
          filename="devotee-report.xls"
          includeImages
        />
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      <div className="admin-table-scroll">
        <table className="table admin-list-table devotee-table">
          <thead>
            <tr>
              <th>ID No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="table-empty-cell">Loading records...</td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty-cell">No devotee records found.</td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>#{row.id}</td>
                  <td>
                    {getPhoto(row) ? (
                      <img
                        className="thumb devotee-thumb"
                        src={getPhoto(row)}
                        alt={row.name || "Devotee"}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>
                    <b>{row.name || "-"}</b>
                    <small>{row.city || ""}</small>
                  </td>
                  <td>
                    {row.phone || "-"}
                    <br />
                    <small>{row.email || ""}</small>
                  </td>
                  <td>{row.created_at || "-"}</td>
                  <td>
                    <select
                      className="select compact devotee-status-select"
                      value={normalizeStatus(row.status)}
                      onChange={(event) => setStatus(row, event.target.value)}
                    >
                      <option value={CONNECTED}>Not Connected</option>
                      <option value={NOT_CONNECTED}>Connected</option>
                    </select>
                  </td>
                  <td>
                    <div className="devotee-row-actions">
                      <button
                        type="button"
                        className="btn secondary"
                        onClick={() => setView(row)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn danger"
                        onClick={() => remove(row)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal}
    </div>
  );
}
