import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    proficiency: {
      type: Number,
      required: [true, 'Skill proficiency is required'],
      min: [0, 'Proficiency cannot be less than 0'],
      max: [100, 'Proficiency cannot be greater than 100'],
      validate: {
        validator: Number.isInteger,
        message: 'Proficiency must be an integer between 0 and 100',
      },
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
    },
    startYear: {
      type: Number,
      required: [true, 'Start year is required'],
      validate: {
        validator: (v) => Number.isInteger(v) && v >= 1900 && v <= 2100,
        message: 'Start year must be a valid year',
      },
    },
    endYear: {
      type: Number,
      default: null,
      validate: {
        validator: function (v) {
          if (v === null || v === undefined) return true;
          return Number.isInteger(v) && v >= 1900 && v <= 2100;
        },
        message: 'End year must be a valid year',
      },
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      // Stores hashed password string; hashing to be handled in the auth layer
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [250, 'Bio cannot exceed 250 characters'],
      default: '',
    },
    avatar: {
      type: String,
      trim: true,
      default: '',
    },
    headline: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [skillSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model caching issues across reloads
if (mongoose.models.User) {
  delete mongoose.models.User;
}
const User = mongoose.model('User', userSchema);

export default User;
