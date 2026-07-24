import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";
import logo from "../../assets/images/shreeji-logo.png";
import { addLog } from "../utils/store";

function Icon({ name }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const icons = {
    user: <><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="m3 3 18 18"/><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2"/><path d="M9.9 5.8A10 10 0 0 1 12 5.5c6.5 0 10 6.5 10 6.5a18 18 0 0 1-3.1 3.9"/><path d="M6.6 6.8C3.6 8.7 2 12 2 12s3.5 6.5 10 6.5c1.5 0 2.8-.3 4-.8"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg {...common}>{icons[name]}</svg>;
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
      const data = await adminApi.login(username.trim(), password);
      const user = { ...data.user, role: data.user?.role === "super_admin" ? "Super Admin" : data.user?.role === "admin" ? "Admin" : "Editor" };
      localStorage.setItem("adminUser", JSON.stringify(user));
      localStorage.setItem("adminToken", data.access_token);
      localStorage.setItem("adminLastActivity", String(Date.now()));
      addLog("Login successfully");
      nav("/admin/dashboard");
    } catch (error) {
      setErr(error.message || "Login failed. Please verify username, password and backend service.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <aside className="login-showcase" aria-label="Admin panel introduction">
          <div className="login-showcase-glow" />
          <div className="login-brand">
            <span className="login-brand-logo"><img src={logo} alt="Shreeji Samipya Trust" /></span>
            <div><strong>Shreeji Samipya Trust</strong><small>Website Administration</small></div>
          </div>
          <div className="login-showcase-content">
            <span className="login-eyebrow"><Icon name="shield" /> Secure Management Portal</span>
            <h1>Manage your complete digital presence from one trusted panel.</h1>
            <p>Update website content, manage devotees, review inquiries, track donations and control admin access securely.</p>
            <div className="login-benefits">
              <span><Icon name="check" /> Role-based access control</span>
              <span><Icon name="check" /> Secure activity timeout</span>
              <span><Icon name="check" /> Responsive on desktop and mobile</span>
            </div>
          </div>
          <p className="login-showcase-footer">Bhakti • Seva • Sanskar</p>
        </aside>

        <div className="login-form-panel">
          <form className="professional-login-form" onSubmit={submit}>
            <div className="login-mobile-brand">
              <img src={logo} alt="Shreeji Samipya Trust" />
              <div><strong>Shreeji Samipya Trust</strong><small>Admin Portal</small></div>
            </div>
            <div className="login-form-heading">
              <span>Welcome back</span>
              <h2>Sign in to Admin Panel</h2>
              <p>Enter your authorised account credentials to continue.</p>
            </div>

            {err && <div className="login-error" role="alert">{err}</div>}

            <label className="login-field">
              <span>Username</span>
              <div className="login-input-wrap">
                <Icon name="user" />
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" autoComplete="username" required autoFocus />
              </div>
            </label>

            <label className="login-field">
              <span>Password</span>
              <div className="login-input-wrap">
                <Icon name="lock" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
                <button className="login-password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>
                  <Icon name={showPassword ? "eyeOff" : "eye"} />
                </button>
              </div>
            </label>

            <div className="login-security-note"><Icon name="shield" /><span>Your session is protected and automatically logs out after inactivity.</span></div>

            <button className="login-submit" type="submit" disabled={busy}>
              <span>{busy ? "Signing in..." : "Sign In Securely"}</span>
              {!busy && <Icon name="arrow" />}
            </button>

            <Link className="login-back-link" to="/">← Back to website</Link>
          </form>
        </div>
      </section>
    </main>
  );
}
