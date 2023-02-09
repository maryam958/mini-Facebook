
import mongoose from "mongoose";



const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    postId:{ type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    isDeleted: { type:Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const commentModel = mongoose.model("comment", commentSchema);
