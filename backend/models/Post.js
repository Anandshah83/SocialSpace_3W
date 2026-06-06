const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text:     { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text:     { type: String, default: "", maxlength: 1000 },
    imageUrl: { type: String, default: "" },
    likes:    { type: [String], default: [] },   // array of usernames
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
