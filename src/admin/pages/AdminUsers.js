import React, { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import { addLog, currentUser } from "../utils/store";
import { roles, roleNote } from "../utils/permissions";

const roleToApi = (role) => role === "Super Admin" ? "super_admin" : role === "Admin" ? "admin" : "editor";
const roleFromApi = (role) => role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "Editor";

export default function AdminUsers() {
  const me = currentUser();
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [view, setView] = useState(null);
  const [message, setMessage] = useState("");
  const allowed = me?.role === "Super Admin";

  useEffect(() => {
    if (!allowed) return;
    adminApi.list("users")
      .then((items) => setRows(items.map((item) => ({ ...item, role: roleFromApi(item.role), active: item.status !== "inactive" }))))
      .catch(() => setRows([]));
  }, [allowed]);

  if (!allowed) {
    return <div className="admin-card"><h2>Access Denied</h2><p>Only Super Admin can create users, assign roles and change passwords.</p></div>;
  }

  const saveUser = async () => {
    const payload = {
      name: edit.name,
      username: edit.username,
      password: edit.password,
      role: roleToApi(edit.role),
      status: edit.active ? "active" : "inactive",
    };
    if (edit.isNew) {
      const created = await adminApi.create("users", payload);
      setRows([{ ...edit, id: created.id, isNew: false }, ...rows]);
    } else {
      await adminApi.update("users", edit.id, payload);
      setRows(rows.map((row) => (row.id === edit.id ? edit : row)));
    }
    addLog("Users updated");
    setMessage("User saved.");
    setEdit(null);
  };

  const deleteUser = async (user) => {
    if (user.username === me?.username) {
      setMessage("You cannot delete your own login.");
      return;
    }
    if (!window.confirm(`Delete user ${user.name}?`)) return;
    await adminApi.remove("users", user.id);
    setRows(rows.filter((row) => row.id !== user.id));
    setMessage("User deleted.");
  };

  return (
    <div className="admin-card">
      <div className="toolbar">
        <div>
          <h2>Users Add</h2>
          <p className="admin-muted">Total users: <b>{rows.length}</b>. Create users, set username/password and assign exact access role.</p>
        </div>
        <button className="btn" onClick={() => setEdit({ isNew: true, name: "", username: "", password: "", role: "Editor", active: true })}>+ Add User</button>
      </div>
      {message && <div className="admin-alert">{message}</div>}
      <table className="table">
        <thead><tr><th>Sr</th><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {rows.map((r, index) => (
            <tr key={r.id}>
              <td>{index + 1}</td>
              <td>{r.name}</td>
              <td>{r.username}</td>
              <td><span className="badge">{r.role}</span></td>
              <td>{r.active ? "Active" : "Blocked"}</td>
              <td>
                <button className="btn secondary" onClick={() => setView(r)}>View</button>{" "}
                <button className="btn secondary" onClick={() => setEdit(r)}>Edit</button>{" "}
                <button className="btn danger" onClick={() => deleteUser(r)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {edit && (
        <div className="modal-bg">
          <div className="modal">
            <div className="toolbar"><h2>{edit.isNew ? "Add User" : `Edit User #${edit.id}`}</h2><button className="btn secondary" onClick={() => setEdit(null)}>Close</button></div>
            <div className="form-grid">
              <label>Name<input className="input" value={edit.name || ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
              <label>Login ID<input className="input" value={edit.username || ""} onChange={(e) => setEdit({ ...edit, username: e.target.value })} /></label>
              <label>Password<input className="input" type="password" value={edit.password || ""} onChange={(e) => setEdit({ ...edit, password: e.target.value })} placeholder={edit.isNew ? "Required" : "Leave blank to keep old"} /></label>
              <label>Role<select className="select" value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })}>{roles.map((r) => <option key={r}>{r}</option>)}</select><small>{roleNote[edit.role]}</small></label>
              <label>Status<select className="select" value={edit.active ? "Active" : "Blocked"} onChange={(e) => setEdit({ ...edit, active: e.target.value === "Active" })}><option>Active</option><option>Blocked</option></select></label>
            </div>
            <button className="btn" onClick={saveUser}>Save User</button>
          </div>
        </div>
      )}
      {view && (
        <div className="modal-bg" onMouseDown={(e) => { if (e.target.className === "modal-bg") setView(null); }}>
          <div className="modal">
            <div className="toolbar"><h2>User View</h2><button className="btn secondary" onClick={() => setView(null)}>Close</button></div>
            <div className="record-view-grid">
              <div className="record-view-field"><span>Name</span><b>{view.name}</b></div>
              <div className="record-view-field"><span>Username</span><b>{view.username}</b></div>
              <div className="record-view-field"><span>Role</span><b>{view.role}</b></div>
              <div className="record-view-field"><span>Status</span><b>{view.active ? "Active" : "Blocked"}</b></div>
              <div className="record-view-field"><span>Failed Attempts</span><b>{view.failed_attempts || 0}</b></div>
              <div className="record-view-field"><span>Lock Cycles</span><b>{view.lock_count || 0}</b></div>
              <div className="record-view-field"><span>Locked Until</span><b>{view.locked_until || "-"}</b></div>
              <div className="record-view-field"><span>Access</span><b>{roleNote[view.role]}</b></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
