import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      
    },
    img: {
      type: String,
    },
    city: {
      type: String,
      
    },
    phone: {
      type: String,
      
    },
    password: {
      type: String,
      
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);