const JwtUtil = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Sem autorização' });
  }

  const token = JwtUtil.extractTokenFromHeader(authHeader);
  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const decoded = JwtUtil.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token expirado ou inválido' });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
