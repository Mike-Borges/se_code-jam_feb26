import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["photo", "text"], required: true },
    memoryDate: {
      month: { type: Number, required: true },
      day: { type: Number, required: true },
      year: { type: Number, required: true },
    },
    text: { type: String, default: "" },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
