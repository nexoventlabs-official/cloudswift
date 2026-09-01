// Simple token-based admin auth middleware.
// Admin panel sends: Authorization: Bearer <ADMIN_TOKEN>

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : header;
  const valid  = process.env.ADMIN_TOKEN || 'cloudswift_admin_session_token_2026';

  if (!token || token !== valid) {
    return res.status(401).json({ success: false, message: 'Unauthorised' });
  }
  next();
}
