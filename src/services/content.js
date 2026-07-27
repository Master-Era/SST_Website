import { apiGet } from "./api";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const WEBSITE_CACHE_KEY = "mandir_website_data";

export function parseContentData(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

export function mediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("src/assets")) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/uploads")) return `${API_ORIGIN}${url}`;
  return url;
}

function getLocalContentMap() {
  try {
    const website = JSON.parse(localStorage.getItem(WEBSITE_CACHE_KEY) || "null");
    return website ? { "Admin Website Data": website } : {};
  } catch {
    return {};
  }
}

export async function getRemoteWebsiteData() {
  const response = await apiGet(
    `/content/${encodeURIComponent("Admin Website Data")}?t=${Date.now()}`
  );
  const website = parseContentData(response?.content_data ?? response);
  if (!website || Object.keys(website).length === 0) return null;
  localStorage.setItem(WEBSITE_CACHE_KEY, JSON.stringify(website));
  return website;
}

export async function getContentMap() {
  try {
    const rows = await apiGet(`/content?t=${Date.now()}`);
    const remoteMap = (Array.isArray(rows) ? rows : []).reduce((map, row) => {
      map[row.page_key] = parseContentData(row.content_data);
      return map;
    }, {});

    const website = remoteMap["Admin Website Data"];
    if (website && Object.keys(website).length) {
      localStorage.setItem(WEBSITE_CACHE_KEY, JSON.stringify(website));
    }

    // Server/database is always the source of truth. Local storage is only a fallback.
    return Object.keys(remoteMap).length ? remoteMap : getLocalContentMap();
  } catch (error) {
    console.error("Live website content could not be loaded:", error);
    return getLocalContentMap();
  }
}
