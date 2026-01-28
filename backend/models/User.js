import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  //  Password Reset Fields
  resetToken: {
    type: String
  },
  resetTokenExpire: {
    type: Date
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
