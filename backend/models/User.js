// backend/models/User.js
// Defines the structure of every user document in MongoDB
// Three roles: farmer (self-registered), owner_admin, demo_admin (both seeded)

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type    : String,
      required: [true, 'Name is required'],
      trim    : true,
    },

    email: {
      type     : String,
      required : [true, 'Email is required'],
      unique   : true,         // no two users with same email
      lowercase: true,
      trim     : true,
      match    : [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    password: {
      type    : String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select  : false,         // never return password in queries by default
    },

    phone: {
      type : String,
      trim : true,
      default: '',
    },

    village: {
      type : String,
      trim : true,
      default: '',
    },

    role: {
      type   : String,
      enum   : ['farmer', 'owner_admin', 'demo_admin'],
      default: 'farmer',
    },
  },
  {
    timestamps: true,          // adds createdAt and updatedAt automatically
  }
);

// Hash password before saving — runs on .save() calls
userSchema.pre('save', async function (next) {
  // Only hash if password was actually changed
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method: compare entered password with hashed one in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);