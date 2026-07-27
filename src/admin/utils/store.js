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
const WEBSITE_SCHEMA_VERSION = 5;

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

function mergeCollection(current = [], defaults = []) {
  const source = Array.isArray(current) ? current : [];
  const mergedDefaults = defaults.map((fallback, index) => {
    const matched = source.find((row) =>
      (fallback.key && row.key === fallback.key) ||
      (fallback.title && row.title === fallback.title) ||
      Number(row.id) === Number(fallback.id)
    ) || source[index];
    return fillItem(matched || {}, fallback);
  });

  const usedIds = new Set(mergedDefaults.map((item) => String(item.id)));
  const usedKeys = new Set(mergedDefaults.map((item) => item.key).filter(Boolean));
  const usedTitles = new Set(mergedDefaults.map((item) => item.title).filter(Boolean));
  const extras = source.filter((item) =>
    !usedIds.has(String(item.id)) &&
    !(item.key && usedKeys.has(item.key)) &&
    !(item.title && usedTitles.has(item.title))
  );

  return [...mergedDefaults, ...extras].map((item, index) => ({
    ...item,
    sortOrder: index + 1,
  }));
}

function normalizeWebsiteData(value) {
  const data = clone(value || {});
  const defaults = clone(defaultWebsiteData);
  data.home = data.home || defaults.home;
  data.activity = data.activity || defaults.activity;
  data.events = data.events || defaults.events;
  data.news = data.news || defaults.news;
  data.gallery = data.gallery || defaults.gallery;
  data.about = data.about || defaults.about;

  data.home.sections = mergeCollection(data.home.sections, defaults.home.sections);
  data.home.hero = mergeCollection(data.home.hero, defaults.home.hero);
  data.home.founder = fillItem(data.home.founder, defaults.home.founder);
  data.activity.activities = mergeCollection(data.activity.activities, defaults.activity.activities);
  data.activity.socialCare = mergeCollection(data.activity.socialCare, defaults.activity.socialCare);
  data.events.items = mergeCollection(data.events.items, defaults.events.items);
  data.about.sections = mergeCollection(data.about.sections, defaults.about.sections)
    .filter((item) => item.title !== "Founder")
    .map((item, index) => ({ ...item, sortOrder: index + 1 }));

  data.news.latest = mergeCollection(data.news.latest, defaults.news.latest || []);
  data.news.announcements = mergeCollection(data.news.announcements, defaults.news.announcements || []);
  data.news.notices = mergeCollection(data.news.notices, defaults.news.notices || []);
  data.news.customSections = mergeCollection(data.news.customSections, defaults.news.customSections || []);

  data.gallery.albums = (data.gallery.albums || defaults.gallery.albums || []).map((album, index) => {
    const fallback = defaults.gallery.albums[index] || {};
    return {
      ...fallback,
      ...album,
      sortOrder: index + 1,
      cover: album.cover || fallback.cover || "",
      images: album.images?.length ? album.images : (fallback.images || []),
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
export const exportExcelWithImages = (filename, rows, title = "Devotee Report") => {
  if (!rows.length) {
    window.alert("No data found");
    return;
  }

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const isImageField = (key) =>
    [
      "photo_data",
      "photo",
      "image",
      "image_url",
      "profile_image",
      "live_image",
      "devotee_image"
    ].includes(String(key).toLowerCase());

  const imageKey = Object.keys(rows[0]).find(isImageField);
  const detailKeys = Object.keys(rows[0]).filter((k) => k !== imageKey);

  const html = `
  <html>
  <body>
    <h2>${title}</h2>
    <table border="1" cellspacing="0" cellpadding="5">
      <tr>
        <th>Image</th>
        ${detailKeys.map(k => `<th>${k}</th>`).join("")}
      </tr>

      ${rows.map(r => `
        <tr>
          <td>
            ${
              imageKey && r[imageKey]
                ? `<img src="${r[imageKey]}" width="100">`
                : "No Image"
            }
          </td>

          ${detailKeys.map(k => `<td>${r[k] ?? ""}</td>`).join("")}
        </tr>
      `).join("")}

    </table>
  </body>
  </html>`;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = filename + ".xls";
  a.click();

  URL.revokeObjectURL(url);
};
export const exportPrint = (title, rows, totalLabel = "") => {
  if (!rows.length) {
    window.alert("No data found");
    return;
  }

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const isImageField = (key) =>
    ["photo_data", "photo", "image", "image_url", "profile_image"].includes(
      String(key).toLowerCase()
    );

  const imageKey = Object.keys(rows[0] || {}).find(isImageField);
  const detailKeys = Object.keys(rows[0] || {}).filter(
    (key) => key !== imageKey
  );

  const win = window.open("", "_blank");
  if (!win) {
    window.alert("Please allow pop-ups to download the PDF report.");
    return;
  }

  const cards = rows
    .map((row, index) => {
      const imageValue = imageKey ? row[imageKey] : "";
      const imageHtml = imageValue
        ? `<img class="devotee-photo" src="${escapeHtml(imageValue)}" alt="${escapeHtml(
            row.name || `Devotee ${index + 1}`
          )}" />`
        : `<div class="devotee-photo no-photo">No Image</div>`;

      const fields = detailKeys
        .map(
          (key) => `
            <div class="field ${
              /address|message|remark|note/i.test(key) ? "wide" : ""
            }">
              <span>${escapeHtml(key.replaceAll("_", " "))}</span>
              <b>${escapeHtml(row[key] === "" || row[key] == null ? "-" : row[key])}</b>
            </div>`
        )
        .join("");

      return `
        <section class="devotee-card">
          <div class="profile">
            ${imageHtml}
            <div>
              <h3>${escapeHtml(row.name || `Devotee ${index + 1}`)}</h3>
              <p>${escapeHtml(row.email || row.phone || "")}</p>
              <strong class="status ${
                row.status === "Connected" ? "connected" : "not-connected"
              }">${escapeHtml(
        row.status === "Connected" ? "Connected" : "Not Connected"
      )}</strong>
            </div>
          </div>
          <div class="field-grid">${fields}</div>
        </section>`;
    })
    .join("");

  win.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; color: #172033; background: #fff; }
    .report-head { display: flex; align-items: center; gap: 14px; border-bottom: 3px solid #f97316; padding-bottom: 12px; margin-bottom: 18px; }
    .report-head img { width: 64px; height: 64px; object-fit: contain; }
    .report-head h1 { margin: 0; color: #ea580c; font-size: 23px; }
    .report-head p { margin: 4px 0 0; color: #64748b; font-size: 12px; }
    .report-title { margin: 0 0 6px; font-size: 21px; }
    .meta { margin-bottom: 16px; color: #64748b; font-size: 12px; }
    .devotee-card { margin: 0 0 16px; padding: 16px; border: 1px solid #dbe5ee; border-radius: 16px; page-break-inside: avoid; break-inside: avoid; }
    .profile { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; padding: 12px; border-radius: 14px; background: #fff7ed; }
    .profile h3 { margin: 0 0 4px; font-size: 20px; }
    .profile p { margin: 0 0 8px; color: #64748b; font-size: 12px; }
    .devotee-photo { width: 105px; height: 105px; flex: 0 0 105px; object-fit: cover; border: 3px solid #fff; border-radius: 14px; background: #f8fafc; }
    .no-photo { display: grid; place-items: center; color: #94a3b8; font-size: 11px; font-weight: bold; }
    .status { display: inline-block; padding: 5px 9px; border-radius: 999px; font-size: 10px; }
    .connected { color: #166534; background: #dcfce7; }
    .not-connected { color: #991b1b; background: #fee2e2; }
    .field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .field { min-width: 0; padding: 9px 10px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; }
    .field.wide { grid-column: 1 / -1; }
    .field span { display: block; margin-bottom: 4px; color: #64748b; font-size: 8px; font-weight: bold; text-transform: uppercase; }
    .field b { display: block; color: #172033; font-size: 10px; line-height: 1.45; overflow-wrap: anywhere; white-space: pre-wrap; }
    .total { margin-top: 14px; font-weight: bold; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .devotee-card { box-shadow: none; }
    }
  </style>
</head>
<body>
  <header class="report-head">
    <img src="${logoImg}" alt="Trust Logo" />
    <div>
      <h1>Shreeji Samipya Trust</h1>
      <p>Shreeji Samipya Trust, Mandir Campus</p>
      <p>Generated: ${escapeHtml(new Date().toLocaleString())}</p>
    </div>
  </header>
  <h2 class="report-title">${escapeHtml(title)}</h2>
  <div class="meta">Total records: ${rows.length}</div>
  ${cards}
  ${totalLabel ? `<div class="total">${escapeHtml(totalLabel)}</div>` : ""}
  <script>
    (function () {
      const images = Array.from(document.images);
      const waitForImage = (img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      };
      Promise.all(images.map(waitForImage)).then(() => {
        setTimeout(() => window.print(), 250);
      });
    })();
  </script>
</body>
</html>`);

  win.document.close();
};
