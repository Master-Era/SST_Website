import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";

const normalizeStatus = (value) =>
  String(value || "").trim().toLowerCase() === "not connected"
    ? "Not Connected"
    : "Connected";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    inquiries: [],
    donations: [],
    devotees: [],
    users: [],
  });

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    const requests = await Promise.allSettled([
      adminApi.list("inquiries"),
      adminApi.list("donations"),
      adminApi.list("devotees"),
      adminApi.list("users"),
    ]);

    const valueOrEmpty = (result) =>
      result.status === "fulfilled" && Array.isArray(result.value)
        ? result.value
        : [];

    setData({
      inquiries: valueOrEmpty(requests[0]),
      donations: valueOrEmpty(requests[1]),
      devotees: valueOrEmpty(requests[2]),
      users: valueOrEmpty(requests[3]),
    });

    if (requests.some((result) => result.status === "rejected")) {
      setError("Some dashboard data could not be loaded. Please refresh after checking the backend.");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const counts = useMemo(() => {
    const connected = data.devotees.filter(
      (row) => normalizeStatus(row.status) === "Connected"
    ).length;
    const notConnected = data.devotees.filter(
      (row) => normalizeStatus(row.status) === "Not Connected"
    ).length;

    return {
      inquiries: data.inquiries.length,
      donations: data.donations.length,
      devotees: data.devotees.length,
      users: data.users.length,
      connected,
      notConnected,
    };
  }, [data]);

  const stats = [
    ["Contact Messages", counts.inquiries, "/admin/inquiries"],
    ["Donation Applications", counts.donations, "/admin/donations"],
    ["Devotee Records", counts.devotees, "/admin/devotees"],
    ["Admin Users", counts.users, "/admin/users"],
  ];

  const maxStat = Math.max(
    ...stats.map(([, value]) => Number(value) || 0),
    1
  );

  return (
    <>
      <div className="dashboard-heading-row">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-muted">Live data loaded from the backend database.</p>
        </div>
        <button className="btn secondary" type="button" onClick={loadDashboard}>
          Refresh Data
        </button>
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      <div className="stats dashboard-stats">
        {stats.map(([label, value, path]) => (
          <button
            className="stat dashboard-card"
            key={label}
            onClick={() => navigate(path)}
            disabled={loading}
          >
            <small>{label}</small>
            <b>{loading ? "…" : value}</b>
            <span>Open</span>
          </button>
        ))}
      </div>

      <br />

      <div className="dashboard-panels">
        <div className="admin-card">
          <h2>Devotee Connection Status</h2>
          <div className="devotee-status-card">
            <button type="button" onClick={() => navigate("/admin/devotees")}> 
              <span>Not Connected Devotees</span>
              <b>{loading ? "…" : counts.connected}</b>
              <small>Click to open records</small>
            </button>
            <button type="button" onClick={() => navigate("/admin/devotees")}> 
              <span>Connected Devotees</span>
              <b>{loading ? "…" : counts.notConnected}</b>
              <small>Click to open records</small>
            </button>
          </div>
        </div>

        <div className="admin-card">
          <h2>Submission Overview</h2>
          <div className="radial-chart-grid">
            {stats.slice(0, 5).map(([label, value, path]) => {
              const percent = Math.max(
                value > 0 ? 8 : 0,
                Math.round((Number(value) / maxStat) * 100)
              );

              return (
                <button
                  className="radial-chart-item"
                  type="button"
                  key={label}
                  onClick={() => navigate(path)}
                >
                  <span className="radial-ring" style={{ "--value": `${percent}%` }}>
                    <b>{loading ? "…" : value}</b>
                  </span>
                  <strong>{label}</strong>
                  <small>{loading ? "Loading live data" : `${percent}% of current data`}</small>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
