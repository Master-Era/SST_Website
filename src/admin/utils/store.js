import { defaultAdmins, defaultInquiries, defaultDonations, defaultDevotees, defaultSettings } from "../data/defaultData";
import logoImg from "../../assets/images/shreeji-logo.png";

const keys = {
  admins: "mandir_admin_users",
  inquiries: "mandir_inquiries",
  donations: "mandir_donations",
  devotees: "mandir_devotees",
  settings: "mandir_settings",
  logs: "mandir_logs",
  notifications: "mandir_notifications",
};

const clone = (v) => JSON.parse(JSON.stringify(v));
export const load = (key, fallback) => {
  const raw = localStorage.getItem(keys[key]);
  if (!raw) { localStorage.setItem(keys[key], JSON.stringify(fallback)); return clone(fallback); }
  try {
    return JSON.parse(raw);
  } catch { return clone(fallback); }
};
export const save = (key, value) => {
  localStorage.setItem(keys[key], JSON.stringify(value));
  return value;
};
export const initStore = () => {
  load("admins", defaultAdmins); load("inquiries", defaultInquiries);
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

export const MAX_ADMIN_IMAGE_SIZE = 5 * 1024 * 1024;

export const validateAdminImage = (file) => {
  if (!file) return { ok: false, message: "Please select an image." };
  if (!String(file.type || "").startsWith("image/")) {
    return { ok: false, message: "Please select a valid image file." };
  }
  if (file.size > MAX_ADMIN_IMAGE_SIZE) {
    return { ok: false, message: `Image size must be 5MB or less. ${file.name || "Selected image"} is ${(file.size / (1024 * 1024)).toFixed(2)}MB.` };
  }
  return { ok: true, message: "" };
};

export const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  if (!file) return resolve("");
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error("File could not be read."));
  reader.readAsDataURL(file);
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
