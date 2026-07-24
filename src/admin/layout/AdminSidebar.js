import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/shreeji-logo.png";

const menu = [
  ["/admin/dashboard", "Dashboard", "dashboard", ["Super Admin", "Admin"]],
  ["/admin/website/home", "Home Edit", "home", ["Super Admin", "Admin", "Editor"]],
  ["/admin/website/activity", "Activity Edit", "activity", ["Super Admin", "Admin", "Editor"]],
  ["/admin/website/events", "Events Edit", "events", ["Super Admin", "Admin", "Editor"]],
  ["/admin/website/news", "News Edit", "news", ["Super Admin", "Admin", "Editor"]],
  ["/admin/website/gallery", "Gallery Edit", "gallery", ["Super Admin", "Admin", "Editor"]],
  ["/admin/website/about", "About Edit", "about", ["Super Admin", "Admin", "Editor"]],
  ["/admin/inquiries", "Inquiry Management", "mail", ["Super Admin", "Admin"]],
  ["/admin/donations", "Donation Management", "donation", ["Super Admin", "Admin"]],
  ["/admin/devotees", "Devotee Records", "users", ["Super Admin", "Admin"]],
  ["/admin/settings", "Settings", "settings", ["Super Admin", "Admin"]],
  ["/admin/users", "Users Add", "userPlus", ["Super Admin"]],
  ["/admin/logs", "Logs", "logs", ["Super Admin"]],
];

function SidebarIcon({ name }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="8" rx="2" /><rect x="14" y="3" width="7" height="5" rx="2" /><rect x="14" y="12" width="7" height="9" rx="2" /><rect x="3" y="15" width="7" height="6" rx="2" /></>,
    home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10.5V20h14v-9.5" /><path d="M9.5 20v-6h5v6" /></>,
    activity: <><path d="M12 2v20" /><path d="M2 12h20" /><path d="m5 5 14 14" /><path d="m19 5-14 14" /></>,
    events: <><rect x="4" y="5" width="16" height="16" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
    news: <><path d="M4 5h12a4 4 0 0 1 4 4v10H8a4 4 0 0 1-4-4V5Z" /><path d="M8 9h7M8 13h8M8 17h5" /></>,
    gallery: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m7 15 3-3 3 3 2-2 3 3" /><circle cx="8.5" cy="9" r="1.5" /></>,
    about: <><circle cx="12" cy="12" r="9" /><path d="M12 10v6M12 7h.01" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
    donation: <><path d="M8 6h8" /><path d="M8 10h7a4 4 0 0 1 0 8H8" /><path d="M8 14h8" /><path d="M10 6v12" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M21 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.04.04a2 2 0 1 1-2.83 2.83l-.04-.04a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1 1.63V21a2 2 0 1 1-4 0v-.06a1.8 1.8 0 0 0-1-1.63 1.8 1.8 0 0 0-2 .36l-.04.04a2 2 0 1 1-2.83-2.83l.04-.04a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.63-1H3a2 2 0 1 1 0-4h.06a1.8 1.8 0 0 0 1.63-1 1.8 1.8 0 0 0-.36-2l-.04-.04A2 2 0 1 1 7.12 3.9l.04.04a1.8 1.8 0 0 0 2 .36h.02a1.8 1.8 0 0 0 1-1.63V3a2 2 0 1 1 4 0v.06a1.8 1.8 0 0 0 1 1.63 1.8 1.8 0 0 0 2-.36l.04-.04a2 2 0 1 1 2.83 2.83l-.04.04a1.8 1.8 0 0 0-.36 2v.02a1.8 1.8 0 0 0 1.63 1H21a2 2 0 1 1 0 4h-.06a1.8 1.8 0 0 0-1.54 1Z" /></>,
    userPlus: <><path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M19 8v6M16 11h6" /></>,
    logs: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function AdminSidebar({ user, setCollapsed, setMobileOpen }) {
  return (
    <aside className="admin-sidebar" onMouseEnter={() => { if (window.innerWidth > 900) setCollapsed(false); }} onMouseLeave={() => { if (window.innerWidth > 900) setCollapsed(true); }}>
      <button className="sidebar-toggle" title="Toggle menu" onClick={() => setCollapsed((current) => !current)}>
        <SidebarIcon name="menu" />
      </button>
      <div className="brand">
        <img className="brand-logo-img" src={logo} alt="Shreeji Samipya" />
        <div className="brand-text"><b>Shreeji Samipya Trust</b><span>Website Control Admin</span></div>
      </div>
      <nav>
        {menu.filter((item) => item[3].includes(user?.role)).map(([to, label, icon]) => (
          <NavLink key={to} to={to} onClick={() => { setCollapsed(true); setMobileOpen?.(false); }} className={({ isActive }) => (isActive ? "active" : "")}>
            <span><SidebarIcon name={icon} /></span><em>{label}</em>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
