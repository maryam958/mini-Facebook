
import mongoose from "mongoose";



const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postImg: {
      type: String,
      required: true,
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    commentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],

    totalCounts: { type:Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const postModel = mongoose.model("post", postSchema);
