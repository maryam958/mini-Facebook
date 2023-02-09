import { commentModel } from "../../../DB/models/comment.model.js";
import { postModel } from "../../../DB/models/post.model.js";
import { userModel } from "../../../DB/models/user.model.js";
import cloudinary from "../../../services/cloudinary.js";
import paginate from "../../../services/pagination.js";

export const addPost = async (req, res) => {
  let { content, image } = req.body;
  let uploadedImg = await cloudinary.uploader.upload(req.file.path, {
    folder: `user/${req.currentUserID}`,
  });
  let post = new postModel({
    content,
    postImg: uploadedImg.secure_url,
    createdBy: req.currentUserID,
  });
  let savedPost = await post.save();
  res.json({ message: "Post Uploaded Successfully", savedPost });
};

export const likePost = async (req, res) => {
  let { postId } = req.params;
  let updatedPost = await postModel.updateOne(
    { _id: postId, likes: { $nin: [req.currentUserID] } },
    {
      $push: { likes: req.currentUserID },
      $pull: { unlikes: req.currentUserID },
      $inc: { totalCounts: 1 },
    },
    { new: true }
  );
  res.json({ message: "Done", updatedPost });
};

export const unLikePost = async (req, res) => {
  let { postId } = req.params;
  let updatedPost = await postModel.updateOne(
    { _id: postId, unlikes: { $nin: [req.currentUserID] } },
    {
      $push: { unlikes: req.currentUserID },
      $pull: { likes: req.currentUserID },
      $inc: { totalCounts: -1 },
    },
    { new: true }
  );
  res.json({ message: "Done", updatedPost });
};

export const updatePost = async (req, res) => {
  let { postId } = req.params;
  let { content } = req.body;
  const post = await postModel.findById(postId);
  if (post) {
    if (post.createdBy.toString() == req.currentUserID.toString()) {
      const updatedPost = await postModel.updateOne({ content });
      res.json({ message: "Updated Successfully", updatedPost });
    } else {
      res.json({ message: "you can't update this post" });
    }
  } else {
    res.json({ message: "Post not found" });
  }
};






export const getAllPosts=async(req,res)=>{
  let{page,size}=req.query
  let{skip,limit}=paginate(page,size)
  const cursor=await postModel.find().skip(skip).limit(limit).cursor()
  let allPosts=[]
  for(let doc=await cursor.next();doc!=null;doc=await cursor.next()){
     let comment=await commentModel.find({postId:doc._id})
     let newObj=doc.toObject()
    newObj.comment=comment 
    allPosts.push(newObj);
  }
  console.log(allPosts);
  res.json({message:"Done",allPosts})
}
























export const deletePost = async (req, res) => {
  try {
    let { postId } = req.params;
    const post = await postModel.findById(postId);
    if (post) {
      if (post.createdBy.toString() == req.currentUserID.toString()) {
        const deletedPost = await postModel.deleteOne();
        res.json({ message: "Deleted", deletedPost });
      } else {
        res.json({ message: "you can't Delete this post" });
      }
    } else {
      res.json({ message: "Post not found" });
    }
  } catch (error) {
    res.json({ message: "Error", error });
  }
};

export const userPosts = async (req, res) => {
  const posts = await postModel
    .find({ createdBy: req.currentUserID })
    .populate("createdBy");
  res.json({ message: "Done", posts });
};


