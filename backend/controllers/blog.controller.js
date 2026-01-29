import { validationResult } from 'express-validator';
import BlogPost from '../models/BlogPost.model.js';

// @desc    Obtener todos los posts publicados (público) o todos los posts (admin)
// @route   GET /api/blog
// @access  Public
export const getAllPosts = async (req, res, next) => {
  try {
    const { category, tag, search, limit = 10, page = 1 } = req.query;

    // Construir query
    let query = {};

    // Solo mostrar publicados si no es admin
    if (!req.user || req.user.role !== 'admin') {
      query.published = true;
    }

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const posts = await BlogPost.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un post por slug
// @route   GET /api/blog/:slug
// @access  Public
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })
      .populate('author', 'username email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    // Solo mostrar si está publicado (a menos que sea admin)
    if (!post.published && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear nuevo post
// @route   POST /api/blog
// @access  Private/Admin
export const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    // Agregar el autor del post
    req.body.author = req.user.id;

    const post = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Post creado exitosamente',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar post
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    let post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    // Actualizar
    post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Post actualizado exitosamente',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publicar/despublicar post
// @route   PATCH /api/blog/:id/publish
// @access  Private/Admin
export const publishPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    post.published = !post.published;
    await post.save();

    res.json({
      success: true,
      message: `Post ${post.published ? 'publicado' : 'despublicado'} exitosamente`,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Incrementar vistas de un post
// @route   POST /api/blog/:slug/view
// @access  Public
export const incrementViews = async (req, res, next) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.json({
      success: true,
      data: { views: post.views }
    });
  } catch (error) {
    next(error);
  }
};
