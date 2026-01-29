import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  summary: {
    type: String,
    required: [true, 'El resumen es requerido'],
    maxlength: [300, 'El resumen no puede exceder 300 caracteres']
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    minlength: [1000, 'El contenido debe tener al menos 1000 caracteres']
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'devops', 'seguridad', 'otros'],
    default: 'otros'
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: String,
  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number, // en minutos
    default: 5
  }
}, {
  timestamps: true
});

// Generar slug automáticamente si no existe
blogPostSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Calcular tiempo de lectura automáticamente
blogPostSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Índice para búsquedas
blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
