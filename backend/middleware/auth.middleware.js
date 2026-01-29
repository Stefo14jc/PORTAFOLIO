import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  let token;

  // Verificar si hay token en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer token
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Agregar usuario al request (sin la contraseña)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Usuario no encontrado' 
        });
      }

      next();
    } catch (error) {
      console.error('Error en autenticación:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido o expirado' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No autorizado, no hay token' 
    });
  }
};

// Middleware para verificar que el usuario sea admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: 'Acceso denegado: solo administradores' 
    });
  }
};

// Generar token JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};
