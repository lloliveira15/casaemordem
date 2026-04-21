const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_super_secreta';

class JwtUtil {
  // Gerar token
  static generateToken(userId, username) {
    const payload = {
      userId,
      username,
      iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return token;
  }

  // Verificar e decodificar token
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (err) {
      return null;
    }
  }

  // Extrair token do header
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

module.exports = JwtUtil;
