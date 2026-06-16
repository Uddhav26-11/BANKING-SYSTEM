const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name must not exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: ['manager', 'employee', 'customer'],
      default: 'customer',
    },

    aadhaarNumber: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^\d{12}$/.test(value);
        },
        message: 'Aadhaar number must be 12 digits',
      },
    },

    photo: {
      type: String,
      default: '',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* Virtual populate for accounts */
userSchema.virtual('accounts', {
  ref: 'Account',
  localField: '_id',
  foreignField: 'userId',
});

/* Hash password before saving */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const saltRounds =
    parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

  this.password = await bcrypt.hash(
    this.password,
    saltRounds
  );
});

/* Compare password */
userSchema.methods.comparePassword =
  async function (candidatePassword) {
    return await bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

/* Remove sensitive fields */
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.__v;

  return user;
};

module.exports = mongoose.model('User', userSchema);