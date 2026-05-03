import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Admin'], default: 'User' },
    avatar: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  console.log('Pre-save middleware triggered');
  console.log('Password modified:', this.isModified('password'));
  
  if (!this.isModified('password')) {
    console.log('Skipping password hashing - not modified');
    return next();
  }
  
  try {
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(12);
    console.log('Salt generated');
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log('Comparing passwords...');
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', result);
    return result;
  } catch (error) {
    console.error('Password comparison error:', error);
    throw new Error('Password comparison failed');
  }
};

userSchema.methods.toSafeObject = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

userSchema.index({ username: 1 }, { collation: { locale: 'en', strength: 2 } });
userSchema.index({ email: 1 }, { collation: { locale: 'en', strength: 2 } });

export default mongoose.model('User', userSchema);
