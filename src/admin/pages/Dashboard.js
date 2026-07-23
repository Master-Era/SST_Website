import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";
import { load } from "../utils/store";

export default function Dashboard() {
  const navigate = useNavigate();
  const web = load("website", {});
  const [counts, setCounts] = useState({ inquiries: 0, donations: 0, devotees: 0, users: 0 });
  const [devoteeStatus, setDevoteeStatus] = useState({ connected: 0, disconnected: 0 });
  const gallery = web.gallery?.albums?.reduce((s, a) => s + (a.images?.length || 0), 0) || 0;
  const events = web.events?.items?.length || 0;

  useEffect(() => {
    Promise.allSettled([
      adminApi.list("inquiries"),
      adminApi.list("donations"),
      adminApi.list("devotees"),
      adminApi.list("users"),
    ]).then(([inq, don, dev, users]) => {
      const devoteeRows = dev.value || [];
      setCounts({
        inquiries: inq.value?.length || 0,
        donations: don.value?.length || 0,
        devotees: devoteeRows.length,
        users: users.value?.length || 0,
      });
      setDevoteeStatus({
        connected: devoteeRows.filter((row) => (row.status || "").toLowerCase() === "connected").length,
        disconnected: devoteeRows.filter((row) => (row.status || "Not connected").toLowerCase() !== "connected").length,
      });
    });
  }, []);

  const stats = [
    ["Contact Messages", counts.inquiries, "/admin/inquiries"],
    ["Donation Apply", counts.donations, "/admin/donations"],
    ["Devotee Records", counts.devotees, "/admin/devotees"],
    ["Admin Users", counts.users, "/admin/users"],
    ["Gallery Images", gallery, "/admin/website/gallery"],
    ["Upcoming Events", events, "/admin/website/events"],
  ];
  const maxStat = Math.max(...stats.slice(0, 5).map(([, value]) => Number(value) || 0), 1);

  return (
    <>
      <div className="stats dashboard-stats">
        {stats.map(([label, value, path]) => (
          <button className="stat dashboard-card" key={label} onClick={() => navigate(path)}>
            <small>{label}</small>
            <b>{value}</b>
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
              <span>Connected Devotees</span>
              <b>{devoteeStatus.connected}</b>
              <small>Click to open records</small>
            </button>
            <button type="button" onClick={() => navigate("/admin/devotees")}>
              <span>Not Connected Devotees</span>
              <b>{devoteeStatus.disconnected}</b>
              <small>Click to open records</small>
            </button>
          </div>
        </div>
        <div className="admin-card">
          <h2>Submission Overview</h2>
          <div className="radial-chart-grid">
            {stats.slice(0, 5).map(([label, value]) => {
              const percent = Math.max(8, Math.round((Number(value) / maxStat) * 100));
              return (
                <button className="radial-chart-item" type="button" key={label} onClick={() => navigate(stats.find((item) => item[0] === label)?.[2] || "/admin/dashboard")}>
                  <span className="radial-ring" style={{ "--value": `${percent}%` }}>
                    <b>{value}</b>
                  </span>
                  <strong>{label}</strong>
                  <small>{percent}% of current data</small>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
