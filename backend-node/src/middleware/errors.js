function notFound(req, res) { res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }); }
function errorHandler(error, _req, res, _next) {
  console.error(error);
  const status = error.status || (error.code === 'ER_DUP_ENTRY' ? 409 : 500);
  res.status(status).json({ message: error.message || 'Server error', ...(error.details ? { errors: error.details } : {}) });
}
module.exports = { notFound, errorHandler };
