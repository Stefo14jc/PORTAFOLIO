import express from 'express';
import { body } from 'express-validator';
import {
  getProfile,
  createProfile,
  updateProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  deleteSkill
} from '../controllers/profile.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validaciones básicas
const profileValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('title').trim().notEmpty().withMessage('El título es requerido'),
  body('email').trim().isEmail().withMessage('Email inválido')
];

// Ruta pública - obtener perfil
router.get('/', getProfile);

// Rutas protegidas - solo admin
router.post('/', protect, adminOnly, profileValidation, createProfile);
router.put('/', protect, adminOnly, profileValidation, updateProfile);

// Experiencia
router.post('/experience', protect, adminOnly, addExperience);
router.put('/experience/:id', protect, adminOnly, updateExperience);
router.delete('/experience/:id', protect, adminOnly, deleteExperience);

// Educación
router.post('/education', protect, adminOnly, addEducation);
router.put('/education/:id', protect, adminOnly, updateEducation);
router.delete('/education/:id', protect, adminOnly, deleteEducation);

// Habilidades
router.post('/skills', protect, adminOnly, addSkill);
router.delete('/skills/:id', protect, adminOnly, deleteSkill);

export default router;
