import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { currentUser, initStore } from "./utils/store";
import AdminLayout from "./layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inquiries from "./pages/Inquiries";
import Donations from "./pages/Donations";
import Devotees from "./pages/Devotees";
import DevoteeDetails from "./pages/DevoteeDetails";
import Settings from "./pages/Settings";
import AdminUsers from "./pages/AdminUsers";
import Logs from "./pages/Logs";
import "./AdminPanel.css";

/*
  Website content (Home, About, Activity, Events, Gallery, News, Contact)
  is no longer editable from this admin panel. All of that is now updated
  directly from code - see backend-node/scripts/website-content.js and
  backend-node/scripts/push-content.js.

  This admin panel is for operational data only: Inquiries, Donations,
  Devotee records - plus core admin operations (dashboard, settings,
  users, logs).
*/

function Guard() {
  if (!currentUser()) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}

export default function AdminPanel() {
  initStore();
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<Guard />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="donations" element={<Donations />} />
        <Route path="devotees" element={<Devotees />} />
        <Route path="devotees/:id" element={<DevoteeDetails />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="logs" element={<Logs />} />
      </Route>
    </Routes>
  );
}
