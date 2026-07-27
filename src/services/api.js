const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("mandir_admin_token");
export const setToken = (token) => localStorage.setItem("mandir_admin_token", token);
export const getUser = () => JSON.parse(localStorage.getItem("mandir_admin_user") || "null");
export const setUser = (user) => localStorage.setItem("mandir_admin_user", JSON.stringify(user));
export const logout = () => {
  localStorage.removeItem("mandir_admin_token");
  localStorage.removeItem("mandir_admin_user");
};

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.detail || "Request failed");
  }
  return payload;
}

export async function apiPost(path, data) {
  return request(path, {
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
}

export async function apiGet(path) {
  return request(path, { method: "GET" });
}

export const apiPut = (path, data = {}) => request(path, { method: "PUT", body: JSON.stringify(data) });
export const apiDelete = (path) => request(path, { method: "DELETE" });

export const adminApi = {
  login: async (username, password) => {
    const data = await apiPost("/admin/login", { username, password });
    setToken(data.access_token);
    setUser(data.user);
    return data;
  },
  dashboard: () => apiGet("/admin/dashboard"),
  list: (module) => apiGet(`/admin/${module}`),
  create: (module, data) => apiPost(`/admin/${module}`, data),
  update: (module, id, data) => apiPut(`/admin/${module}/${id}`, data),
  move: (module, id, direction) => apiPut(`/admin/${module}/${id}/move`, { direction }),
  remove: (module, id) => apiDelete(`/admin/${module}/${id}`),
  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return apiPost("/admin/upload", form);
  },
  settings: () => apiGet("/admin/settings"),
  saveSettings: (data) => apiPut("/admin/settings", data),
  exportFile: (module, format) => {
    const url = `${API_BASE_URL}/admin/export/${module}.${format}?token=${encodeURIComponent(getToken() || "")}`;
    window.open(url, "_blank");
  },
};
