// external imports
const mongoose = require("mongoose");
const peopleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      require: true,
      trim: false,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const People = mongoose.model("people", peopleSchema);

module.exports = People;
