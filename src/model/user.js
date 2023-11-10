const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true, // 'require' should be 'required'
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // Use timestamps: true to include createdAt and updatedAt fields

const User = mongoose.model("User", userSchema);

module.exports = User;
