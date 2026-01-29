import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  current: {
    type: Boolean,
    default: false
  },
  description: String
});

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  location: String,
  startDate: Date,
  endDate: Date,
  current: {
    type: Boolean,
    default: false
  },
  description: String
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'tools', 'other'],
    default: 'other'
  },
  level: {
    type: String,
    enum: ['básico', 'intermedio', 'avanzado', 'experto'],
    default: 'intermedio'
  }
});

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'El título profesional es requerido'],
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'La biografía no puede exceder 500 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
  },
  phone: String,
  location: String,
  website: String,
  github: String,
  linkedin: String,
  twitter: String,
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  languages: [{
    name: String,
    level: {
      type: String,
      enum: ['básico', 'intermedio', 'avanzado', 'nativo']
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
