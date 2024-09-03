import { model, models, Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, trim: true }, // Added trim to remove extra spaces
  email: { type: String, required: true, unique: true, trim: true, lowercase: true }, // Trim and lowercase for better consistency
  password: { type: String, required: true }, // Make password required
  image: { type: String, default: '' }, // Set a default value for image
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);
