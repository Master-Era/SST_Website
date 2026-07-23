import { apiGet } from "./api";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export function parseContentData(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (error) {
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

export async function getContentMap() {
  const localMap = getLocalContentMap();
  try {
    const rows = await apiGet("/content");
    const remoteMap = rows.reduce((map, row) => {
      map[row.page_key] = parseContentData(row.content_data);
      return map;
    }, {});
    return { ...remoteMap, ...localMap };
  } catch {
    return localMap;
  }
}

function getLocalContentMap() {
  try {
    const website = JSON.parse(localStorage.getItem("mandir_website_data") || "null");
    if (!website) return {};
    const map = { "Admin Website Data": website };
    const home = website.home || {};
    map["Home - Hero Images"] = {
      title: "Home Hero Images",
      imageUrls: (home.hero || []).map((item) => item.image).filter(Boolean).join("\n"),
    };
    (home.sections || []).forEach((item) => {
      if (!item?.title) return;
      map[`Home - ${item.title}`] = {
        title: item.title,
        description: item.content || "",
        imageUrl: item.image || "",
      };
    });
    (website.activity?.activities || []).forEach((item) => {
      if (!item?.title) return;
      map[`Home Activity - ${item.title}`] = {
        title: item.title,
        description: item.content || "",
        imageUrl: item.image || "",
      };
    });
    if (home.founder) {
      map["Home - Founder Image"] = {
        title: home.founder.title || home.founder.name || "Founder",
        description: home.founder.content || "",
        imageUrl: home.founder.image || "",
      };
    }
    return map;
  } catch {
    return {};
  }
}
