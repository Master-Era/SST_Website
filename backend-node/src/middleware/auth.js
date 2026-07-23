const { verifyToken } = require('../services/authService');
const AppError = require('../utils/appError');

async function requireAuth(req, _res, next) {
  try {
    const header = req.get('authorization') || '';
    const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7) : (req.query.token || '');
    req.admin = await verifyToken(token);
    next();
  } catch (error) { next(error); }
}
function requireAdmin(req, _res, next) {
  if (!['super_admin', 'admin'].includes(req.admin?.role)) return next(new AppError(403, 'Access denied'));
  next();
}
function requireSuperAdmin(req, _res, next) {
  if (req.admin?.role !== 'super_admin') return next(new AppError(403, 'Super Admin only'));
  next();
}
module.exports = { requireAuth, requireAdmin, requireSuperAdmin };
