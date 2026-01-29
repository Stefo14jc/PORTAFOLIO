import express from 'express';
import { body } from 'express-validator';
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  incrementViews
} from '../controllers/blog.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validaciones
const postValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ max: 200 })
    .withMessage('El título no puede exceder 200 caracteres'),
  body('summary')
    .trim()
    .notEmpty()
    .withMessage('El resumen es requerido')
    .isLength({ max: 300 })
    .withMessage('El resumen no puede exceder 300 caracteres'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('El contenido es requerido')
    .isLength({ min: 1000 })
    .withMessage('El contenido debe tener al menos 1000 caracteres')
];

// Rutas públicas
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.post('/:slug/view', incrementViews);

// Rutas protegidas - solo admin
router.post('/', protect, adminOnly, postValidation, createPost);
router.put('/:id', protect, adminOnly, postValidation, updatePost);
router.delete('/:id', protect, adminOnly, deletePost);
router.patch('/:id/publish', protect, adminOnly, publishPost);

export default router;
