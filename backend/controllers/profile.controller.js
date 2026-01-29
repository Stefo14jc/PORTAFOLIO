import { validationResult } from 'express-validator';
import Profile from '../models/Profile.model.js';

// @desc    Obtener perfil público
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear perfil
// @route   POST /api/profile
// @access  Private/Admin
export const createProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    // Verificar si ya existe un perfil
    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un perfil. Usa la ruta de actualización.'
      });
    }

    const profile = await Profile.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Perfil creado exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar perfil
// @route   PUT /api/profile
// @access  Private/Admin
export const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    let profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    // Actualizar campos
    Object.keys(req.body).forEach(key => {
      profile[key] = req.body[key];
    });

    await profile.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Agregar experiencia
// @route   POST /api/profile/experience
// @access  Private/Admin
export const addExperience = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    profile.experience.push(req.body);
    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Experiencia agregada exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar experiencia
// @route   PUT /api/profile/experience/:id
// @access  Private/Admin
export const updateExperience = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    const experience = profile.experience.id(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada'
      });
    }

    Object.keys(req.body).forEach(key => {
      experience[key] = req.body[key];
    });

    await profile.save();

    res.json({
      success: true,
      message: 'Experiencia actualizada exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar experiencia
// @route   DELETE /api/profile/experience/:id
// @access  Private/Admin
export const deleteExperience = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    profile.experience = profile.experience.filter(
      exp => exp._id.toString() !== req.params.id
    );

    await profile.save();

    res.json({
      success: true,
      message: 'Experiencia eliminada exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Agregar educación
// @route   POST /api/profile/education
// @access  Private/Admin
export const addEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    profile.education.push(req.body);
    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Educación agregada exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar educación
// @route   PUT /api/profile/education/:id
// @access  Private/Admin
export const updateEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    const education = profile.education.id(req.params.id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Educación no encontrada'
      });
    }

    Object.keys(req.body).forEach(key => {
      education[key] = req.body[key];
    });

    await profile.save();

    res.json({
      success: true,
      message: 'Educación actualizada exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar educación
// @route   DELETE /api/profile/education/:id
// @access  Private/Admin
export const deleteEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    profile.education = profile.education.filter(
      edu => edu._id.toString() !== req.params.id
    );

    await profile.save();

    res.json({
      success: true,
      message: 'Educación eliminada exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Agregar habilidad
// @route   POST /api/profile/skills
// @access  Private/Admin
export const addSkill = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    profile.skills.push(req.body);
    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Habilidad agregada exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar habilidad
// @route   DELETE /api/profile/skills/:id
// @access  Private/Admin
export const deleteSkill = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    profile.skills = profile.skills.filter(
      skill => skill._id.toString() !== req.params.id
    );

    await profile.save();

    res.json({
      success: true,
      message: 'Habilidad eliminada exitosamente',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};
