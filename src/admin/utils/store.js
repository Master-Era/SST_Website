import { defaultAdmins, defaultWebsiteData, defaultInquiries, defaultDonations, defaultDevotees, defaultSettings } from "../data/defaultData";
import logoImg from "../../assets/images/shreeji-logo.png";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const keys = {
  admins: "mandir_admin_users",
  website: "mandir_website_data",
  inquiries: "mandir_inquiries",
  donations: "mandir_donations",
  devotees: "mandir_devotees",
  settings: "mandir_settings",
  logs: "mandir_logs",
  notifications: "mandir_notifications",
};
const WEBSITE_SCHEMA_VERSION = 4;

const clone = (v) => JSON.parse(JSON.stringify(v));
export const load = (key, fallback) => {
  const raw = localStorage.getItem(keys[key]);
  if (!raw) { localStorage.setItem(keys[key], JSON.stringify(fallback)); return clone(fallback); }
  try {
    const parsed = JSON.parse(raw);
    if (key === "website" && parsed?.__schemaVersion !== WEBSITE_SCHEMA_VERSION) {
      const normalized = normalizeWebsiteData(parsed);
      normalized.__schemaVersion = WEBSITE_SCHEMA_VERSION;
      localStorage.setItem(keys[key], JSON.stringify(normalized));
      return normalized;
    }
    return parsed;
  } catch { return clone(fallback); }
};
export const save = (key, value) => {
  const nextValue = key === "website" ? { ...value, __schemaVersion: WEBSITE_SCHEMA_VERSION } : value;
  localStorage.setItem(keys[key], JSON.stringify(nextValue));
  if (key === "website") syncWebsiteToBackend(nextValue);
  return nextValue;
};
export const initStore = () => {
  load("admins", defaultAdmins); load("website", defaultWebsiteData); load("inquiries", defaultInquiries);
  load("donations", defaultDonations); load("devotees", defaultDevotees); load("settings", defaultSettings);
  load("logs", []); load("notifications", []);
};
export const currentUser = () => JSON.parse(localStorage.getItem("adminUser") || "null");
export const canManageUsers = () => currentUser()?.role === "Super Admin";
export const canViewRecords = () => ["Super Admin", "Admin"].includes(currentUser()?.role);
export const nextId = (rows) => rows.length ? Math.max(...rows.map(r => Number(r.id) || 0)) + 1 : 1;
export const addLog = (action) => {
  const logs = load("logs", []);
  logs.unshift({ id: nextId(logs), user: currentUser()?.username || "system", role: currentUser()?.role || "", action, time: new Date().toLocaleString() });
  save("logs", logs.slice(0, 300));
};
export const addNotification = (message, type = "info") => {
  const items = load("notifications", []);
  items.unshift({ id: nextId(items), message, type, read: false, time: new Date().toLocaleString() });
  save("notifications", items.slice(0, 300));
};

const adminToken = () => localStorage.getItem("mandir_admin_token") || localStorage.getItem("adminToken") || "";

async function putPageContent(pageKey, contentData) {
  const token = adminToken();
  if (!token || token === "local-demo-token") return;
  try {
    await fetch(`${API_BASE_URL}/admin/page-content`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ page_key: pageKey, content_data: contentData }),
    });
  } catch {
    // Keep local admin editing usable even if backend is temporarily offline.
  }
}

function syncWebsiteToBackend(website) {
  putPageContent("Admin Website Data", website);

  const home = website?.home || {};
  const homeSections = home.sections || [];
  const heroImages = (home.hero || []).map((item) => item.image).filter(Boolean).join("\n");

  putPageContent("Home - Hero Images", {
    title: "Home Hero Images",
    imageUrls: heroImages,
  });

  homeSections.forEach((item) => {
    if (!item?.title) return;
    putPageContent(`Home - ${item.title}`, {
      title: item.title,
      description: item.content || "",
      imageUrl: item.image || "",
    });
  });

  const activityTitles = ["Blood Donation", "Health Care", "Educate Child", "Food Donation", "Child Education", "Health Camp"];
  (website?.activity?.activities || []).forEach((item) => {
    if (!item?.title || !activityTitles.includes(item.title)) return;
    putPageContent(`Home Activity - ${item.title}`, {
      title: item.title,
      description: item.content || "",
      imageUrl: item.image || "",
    });
  });

  if (home.founder) {
    putPageContent("Home - Founder Image", {
      title: home.founder.title || home.founder.name || "Founder",
      description: home.founder.content || "",
      imageUrl: home.founder.image || "",
    });
  }
}

function fillItem(item = {}, fallback = {}) {
  return {
    ...fallback,
    ...item,
    title: item.title || fallback.title,
    content: item.content || fallback.content,
    image: item.image || fallback.image,
  };
}

function normalizeWebsiteData(value) {
  const data = clone(value || {});
  const defaults = clone(defaultWebsiteData);
  data.home = data.home || defaults.home;
  data.activity = data.activity || defaults.activity;
  data.events = data.events || defaults.events;
  data.news = data.news || defaults.news;
  data.news.latest = data.news.latest || defaults.news.latest;
  data.news.announcements = data.news.announcements || defaults.news.announcements;
  data.news.notices = data.news.notices || defaults.news.notices;
  data.news.customSections = data.news.customSections || defaults.news.customSections || [];
  data.gallery = data.gallery || defaults.gallery;
  data.about = data.about || defaults.about;

  const legacyHomeTitles = (data.home.sections || []).map((item) => item.title).join("|");
  if (legacyHomeTitles === "Shreeji Samipya Sanstha|Activities|Events") {
    data.home.sections = defaults.home.sections;
  } else {
    data.home.sections = defaults.home.sections.map((fallback, index) => {
      const item = (data.home.sections || []).find((row) => row.title === fallback.title || row.key === fallback.key) || (data.home.sections || [])[index];
      return fillItem(item, fallback);
    });
  }

  data.home.hero = defaults.home.hero.map((fallback, index) => fillItem((data.home.hero || [])[index], fallback));
  data.home.founder = fillItem(data.home.founder, defaults.home.founder);
  data.activity.activities = defaults.activity.activities.map((fallback, index) => {
    const item = (data.activity.activities || []).find((row) => row.title === fallback.title) || (data.activity.activities || [])[index];
    return fillItem(item, fallback);
  });
  data.activity.socialCare = defaults.activity.socialCare.map((fallback, index) => {
    const item = (data.activity.socialCare || []).find((row) => row.title === fallback.title) || (data.activity.socialCare || [])[index];
    return fillItem(item, fallback);
  });
  data.events.items = defaults.events.items.map((fallback, index) => fillItem((data.events.items || [])[index], fallback));
  data.about.sections = defaults.about.sections.map((fallback, index) => {
    const item = (data.about.sections || []).find((row) => row.title === fallback.title) || (data.about.sections || [])[index];
    return fillItem(item, fallback);
  }).filter((item) => item.title !== "Founder");
  data.gallery.albums = (data.gallery.albums || defaults.gallery.albums).map((album, index) => {
    const fallback = defaults.gallery.albums[index] || defaults.gallery.albums[0];
    return {
      ...fallback,
      ...album,
      cover: album.cover || fallback.cover,
      images: album.images?.length ? album.images : fallback.images,
    };
  });
  return data;
}
export const fileToDataUrl = (file) => new Promise((resolve) => {
  if (!file) return resolve("");
  const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file);
});
const getRowDate = (row) => String(row.created_at || row.createdAt || row.date || "").slice(0, 10);

export const filterByDateName = (rows, q, from, to) => rows.filter(r => {
  const text = `${r.name || ""} ${r.title || ""} ${r.phone || ""} ${r.email || ""}`.toLowerCase();
  const okQ = !q || text.includes(q.toLowerCase());
  const d = getRowDate(r);
  const okFrom = !from || d >= from;
  const okTo = !to || d <= to;
  return okQ && okFrom && okTo;
});
export const exportCSV = (filename, rows) => {
  if (!rows.length) return alert("No data found");
  const headers = Object.keys(rows[0]).filter(k => !String(rows[0][k]).startsWith("data:image"));
  const reportHeader = [
    ["Shreeji Samipya Trust"],
    ["Address", "Shreeji Samipya Trust, Mandir Campus"],
    ["Contact", "+91 98765 43210", "Email", "info@shreejisamipya.org"],
    ["Generated At", new Date().toLocaleString()],
    [],
  ];
  const csv = [
    ...reportHeader.map(row => row.map(cell => `"${String(cell ?? "").replaceAll('"','""')}"`).join(",")),
    headers.join(","),
    ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replaceAll('"','""')}"`).join(","))
  ].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"})); a.download = filename; a.click();
};
export const exportPrint = (title, rows, totalLabel = "") => {
  if (!rows.length) return alert("No data found");
  const win = window.open("", "_blank");
  const keys = rows[0] ? Object.keys(rows[0]).filter(k => !String(rows[0][k]).startsWith("data:image")) : [];
  win.document.write(`<html><head><title>${title}</title><style>body{font-family:Arial;padding:24px;color:#111827}.report-head{display:flex;align-items:center;gap:14px;border-bottom:3px solid #0f766e;padding-bottom:12px;margin-bottom:18px}.report-head img{width:68px;height:68px;object-fit:contain}.report-head h1{margin:0;color:#0f766e;font-size:24px}.report-head p{margin:4px 0 0;color:#475569}.meta{margin-bottom:14px;color:#475569}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;font-size:12px;vertical-align:top}th{background:#ecfeff;color:#0f766e}.total{margin-top:18px;font-weight:bold}</style></head><body><div class="report-head"><img src="${logoImg}" alt="Logo"/><div><h1>Shreeji Samipya Trust</h1><p>Address: Shreeji Samipya Trust, Mandir Campus</p><p>Contact: +91 98765 43210 | Email: info@shreejisamipya.org</p></div></div><h2>${title}</h2><div class="meta">Generated At: ${new Date().toLocaleString()}</div><table><thead><tr>${keys.map(k=>`<th>${k}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${keys.map(k=>`<td>${r[k] ?? ""}</td>`).join("")}</tr>`).join("")}</tbody></table><div class='total'>${totalLabel}</div><script>window.print()</script></body></html>`);
  win.document.close();
};
