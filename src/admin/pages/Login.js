import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";
import logo from "../../assets/images/shreeji-logo.png";
import { addLog } from "../utils/store";

function EyeIcon({ open }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  return (
    <svg {...common}>
      {open ? (
        <>
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="m3 3 18 18" />
          <path d="M10.6 10.6A3 3 0 0 0 13.4 13.4" />
          <path d="M9.9 5.8A10.6 10.6 0 0 1 12 5.5C18.4 5.5 22 12 22 12a18.4 18.4 0 0 1-3.1 3.9" />
          <path d="M6.6 6.8C3.6 8.7 2 12 2 12s3.6 6.5 10 6.5c1.5 0 2.8-.3 4-.8" />
        </>
      )}
    </svg>
  );
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const data = await adminApi.login(username, password);
      const user = { ...data.user, role: data.user?.role === "super_admin" ? "Super Admin" : data.user?.role === "admin" ? "Admin" : "Editor" };
      localStorage.setItem("adminUser", JSON.stringify(user));
      localStorage.setItem("adminToken", data.access_token);
      localStorage.setItem("adminLastActivity", String(Date.now()));
      addLog("Login successfully");
      nav("/admin/dashboard");
    } catch (error) {
      setErr(error.message || "Login failed. Please start FastAPI backend first.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={submit}>
        <img className="login-logo" src={logo} alt="Shreeji Samipya" />
        <h1>Shreeji Samipya Admin</h1>
        <p>Secure website management panel</p>
        {err && <div className="error">{err}</div>}
        <label>Username<input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" autoComplete="username" /></label>
        <br />
        <label>Password
          <div className="password-wrap">
            <input className="input" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" />
            <button className="password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </label>
        <br />
        <button className="btn" style={{ width: "100%" }} disabled={busy}>{busy ? "Please wait..." : "Login"}</button>
      </form>
    </div>
  );
}
