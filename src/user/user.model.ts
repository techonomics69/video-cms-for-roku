import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  lastModified: { type: Date, default: null },
});

export interface User extends mongoose.Document {
  id: string;
  fullName: string;
  email: string;
  password: string;
}
