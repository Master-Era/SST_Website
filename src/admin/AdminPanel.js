import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { bootstrapWebsiteFromBackend, currentUser, initStore } from "./utils/store";
import AdminLayout from "./layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HomeEdit from "./pages/HomeEdit";
import ActivityEdit from "./pages/ActivityEdit";
import EventsEdit from "./pages/EventsEdit";
import NewsEdit from "./pages/NewsEdit";
import GalleryEdit from "./pages/GalleryEdit";
import AboutEdit from "./pages/AboutEdit";
import ContactEdit from "./pages/ContactEdit";
import Inquiries from "./pages/Inquiries";
import Donations from "./pages/Donations";
import Devotees from "./pages/Devotees";
import DevoteeDetails from "./pages/DevoteeDetails";
import Settings from "./pages/Settings";
import AdminUsers from "./pages/AdminUsers";
import Logs from "./pages/Logs";
import "./AdminPanel.css";

function Guard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    bootstrapWebsiteFromBackend().finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  if (!currentUser()) return <Navigate to="/admin/login" replace />;
  if (loading) return <div className="admin-loading-screen">Loading live website data...</div>;
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
        <Route path="website/home" element={<HomeEdit />} />
        <Route path="website/activity" element={<ActivityEdit />} />
        <Route path="website/events" element={<EventsEdit />} />
        <Route path="website/news" element={<NewsEdit />} />
        <Route path="website/gallery" element={<GalleryEdit />} />
        <Route path="website/about" element={<AboutEdit />} />
        <Route path="website/contact" element={<ContactEdit />} />
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
