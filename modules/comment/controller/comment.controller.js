import { commentModel } from "../../../DB/models/comment.model.js";
import { postModel } from "../../../DB/models/post.model.js";

export const addComment = async (req, res) => {
  let { content } = req.body;
  let userId = req.currentUserID;
  let { postId } = req.params;
  let post = await postModel.findById(postId);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
  } else {
    let comment = new commentModel({ content, userId, postId });
    let savedComment = await comment.save();
    let addedToPosts = await postModel.findByIdAndUpdate(postId, {
      $push: { commentsId: savedComment._id },
    });
    res.status(201).json({ message: "Comment Added", savedComment });
    // console.log(addedToPosts);
  }
};

export const deleteComment = async (req, res) => {
  let { postId,commentId } = req.params;
    let post = await postModel.findByIdAndUpdate(
      postId,
      {
        $pull: { commentsId: commentId },
      },
      { new: true }
    );
    
    const deletedComment = await commentModel.findByIdAndDelete(commentId);
    res.json({ message: "Comment deleted Successfully", deletedComment });
  } 

