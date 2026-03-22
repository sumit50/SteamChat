import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  userName: {
    type: String,
    required: true,
  },

  // phone: {
  //   type: String,
  //   required: true,
  // },

  // address: {
  //   type: String,
  //   required: true,
  // },


  avatar: {
    type: String, 
    default: "",
  },

  status: {
    type: String,
    default: "Hey there! I am using chat app ",
  },

  isOnline: {
    type: Boolean,
    default: false,
  },

  lastSeen: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)