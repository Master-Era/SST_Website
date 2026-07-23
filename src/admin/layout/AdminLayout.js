import React, { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";
import { currentUser, load, save } from "../utils/store";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";
import "./AdminSidebar.css";

function Icon({ name }) {
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
    moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = currentUser();
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [credentialOpen, setCredentialOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: "", password: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("adminSidebar") !== "open");
  const [dark, setDark] = useState(() => localStorage.getItem("adminTheme") === "dark");
  const topActionsRef = useRef(null);
  const notifications = load("notifications", []);
  const unread = notifications.filter((n) => !n.read).length;

  const logout = useCallback(() => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("mandir_admin_user");
    localStorage.removeItem("mandir_admin_token");
    localStorage.removeItem("adminLastActivity");
    navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    const mark = () => localStorage.setItem("adminLastActivity", String(Date.now()));
    const check = setInterval(() => {
      const last = Number(localStorage.getItem("adminLastActivity") || Date.now());
      if (Date.now() - last > 3 * 60 * 1000) logout();
    }, 15000);
    ["click", "keydown", "mousemove", "scroll", "touchstart"].forEach((event) => window.addEventListener(event, mark));
    mark();
    return () => {
      clearInterval(check);
      ["click", "keydown", "mousemove", "scroll", "touchstart"].forEach((event) => window.removeEventListener(event, mark));
    };
  }, [logout]);

  useEffect(() => {
    const closeFloating = (event) => {
      if (!topActionsRef.current?.contains(event.target)) {
        setOpenNotif(false);
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", closeFloating);
    document.addEventListener("touchstart", closeFloating);
    return () => {
      document.removeEventListener("mousedown", closeFloating);
      document.removeEventListener("touchstart", closeFloating);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("adminSidebar", collapsed ? "collapsed" : "open");
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem("adminTheme", dark ? "dark" : "day");
  }, [dark]);

  const markRead = () => {
    save("notifications", notifications.map((n) => ({ ...n, read: true })));
    setOpenNotif(false);
  };
  const updateSuperAdmin = async () => {
    if (user?.role !== "Super Admin") return;
    const nextUsername = profileForm.username.trim() || user.username;
    const payload = {
      name: user.name,
      username: nextUsername,
      password: profileForm.password || undefined,
      role: "super_admin",
      status: "active",
    };
    try {
      await adminApi.update("users", user.id, payload);
      const nextUser = { ...user, username: nextUsername };
      localStorage.setItem("adminUser", JSON.stringify(nextUser));
      localStorage.setItem("mandir_admin_user", JSON.stringify({ ...nextUser, role: "super_admin" }));
      setProfileMessage("Login updated successfully.");
      setProfileForm({ username: "", password: "" });
      setCredentialOpen(false);
    } catch (error) {
      setProfileMessage(error.message || "Unable to update login.");
    }
  };

  return (
    <div className={`admin-shell ${collapsed ? "is-collapsed" : ""} ${dark ? "dark-mode" : "day-mode"}`}>
      <AdminSidebar user={user} setCollapsed={setCollapsed} />
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Power By Master Era</h1>
            <p>Live website content, records, media and users</p>
          </div>
          <div className="top-actions" ref={topActionsRef}>
            <button className="icon-btn" title="Day/Dark mode" onClick={() => setDark(!dark)}><Icon name={dark ? "sun" : "moon"} /></button>
            <button className="icon-btn" title="Notifications" onClick={() => { setOpenNotif(!openNotif); setOpenProfile(false); }}><Icon name="bell" />{unread > 0 && <em>{unread}</em>}</button>
            <button className="profile profile-icon-only" title="Profile" onClick={() => { setOpenProfile(!openProfile); setOpenNotif(false); }}><span>{user?.name?.[0] || "A"}</span></button>
            {openNotif && <div className="drop notification-drop"><b>Notifications</b>{notifications.slice(0, 8).map((n) => <p key={n.id}>{n.message}<small>{n.time}</small></p>)}<button onClick={markRead}>Mark all read</button></div>}
            {openProfile && (
              <div className="drop profile-drop">
                <p><b>{user?.name}</b><small>{user?.username}</small></p>
                {user?.role === "Super Admin" && (
                  <>
                    <button className="credential-trigger" type="button" onClick={() => setCredentialOpen(!credentialOpen)}>
                      Change Credential
                    </button>
                    {credentialOpen && (
                      <div className="profile-change-box">
                        <strong>Super Admin Login</strong>
                        <input
                          className="input"
                          placeholder="New username"
                          value={profileForm.username}
                          onChange={(event) => setProfileForm({ ...profileForm, username: event.target.value })}
                        />
                        <input
                          className="input"
                          type="password"
                          placeholder="New password"
                          value={profileForm.password}
                          onChange={(event) => setProfileForm({ ...profileForm, password: event.target.value })}
                        />
                        {profileMessage && <small className="profile-message">{profileMessage}</small>}
                        <button type="button" onClick={updateSuperAdmin}>Update Login</button>
                      </div>
                    )}
                  </>
                )}
                <button type="button" onClick={logout}>Sign out</button>
              </div>
            )}
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
