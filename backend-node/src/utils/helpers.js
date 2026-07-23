function parseJson(value, fallback = {}) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

function safeFilename(name = 'upload') {
  return name.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-');
}

function toBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

module.exports = { parseJson, safeFilename, toBoolean };
