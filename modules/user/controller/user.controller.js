import { userModel } from "../../../DB/models/user.model.js";
import { postModel } from "../../../DB/models/post.model.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../../../services/cloudinary.js";
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from "http-status-codes";

// ## 5- change password (user must be logged in)
export const changePassword = async (req, res) => {
  try {
    let { currentPassword, newPassword, newCPassword } = req.body;
    if (newPassword == newCPassword) {
      let user = await userModel.findById(req.currentUserID);
      let matched = await bcryptjs.compare(currentPassword, user.password);
      if (matched) {
        let hashedPass = await bcryptjs.hash(
          newPassword,
          parseInt(process.env.saltRound)
        );
        let updatedUser = await userModel.findByIdAndUpdate(
          user._id,
          { password: hashedPass },
          { new: true }
        );
        res.json({ message: "Updated", updatedUser });
      } else {
        res.json({ message: "currentPassword Invalid" });
      }
    } else {
      res.json({ message: "newPassword must equal newCPassword" });
    }
  } catch (error) {
    res.json({ message: "Error", error });
  }
};

// ## 6- DELETE USER (account owner only)(user must be logged in and confirmed)(Apply Joi validation)
export const DeleteUser = async (req, res) => {
  const user = await userModel.findById({ _id: req.currentUserID });
  if (user) {
    const posts = await postModel.deleteMany({ createdBy: req.currentUserID });
    const deletedUser = await userModel.findByIdAndDelete({
      _id: req.currentUserID,
    });
    res.json({ message: "Done", deletedUser });
  } else {
    res.json({ message: "Failed" });
  }
};

// ## 7- Get all users (user must be logged in and confirmed)
export const getAllUsers = async (req, res) => {
  try {
    const AllUsers = await userModel.find();
    res.json({ message: "All Users", AllUsers });
  } catch (error) {
    res.json({ message: "Error", error });
  }
};

// ## 8- get specific user by id with his posts (user must be logged in and confirmed)(Apply Joi validation)
export const getSpecificUser = async (req, res) => {
  const user = await userModel.findById({ _id: req.currentUserID });
  if (user) {
    const posts = await postModel.find({ createdBy: req.currentUserID });
    res.json({ message: "Posts", posts });
  } else {
    res.json({ message: "Failed" });
  }
};

// ## 9- upload profile picture (upload images on cloudinary)
export const profilePic = async (req, res) => {
  let { image } = req.body;
  let uploadedImg = await cloudinary.uploader.upload(req.file.path, {
    folder: `user/${req.currentUserID}`,
  });
  let profilePic = await userModel.findByIdAndUpdate(
    { _id: req.currentUserID },
    { profilePic: uploadedImg.secure_url }
  );
  console.log(uploadedImg);
  res.json({ message: "Done", profilePic });
};

// ## 10- upload cover picture (upload images on cloudinary)
const cloudinaryImageUploadMethod = async (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(file, (err, res) => {
      if (err)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send("upload image error");
      resolve({
        res: res.secure_url,
      });
    });
  });
};

export const coverPic = async (req, res) => {
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await cloudinaryImageUploadMethod(path);
    urls.push(newPath);
  }

  const coverPic = await userModel.updateOne(
    { _id: req.currentUserID },
    {
      coverPics: urls.map((url) => url.res),
    }
    
  );

  console.log(coverPic);
  res.json({ message: "Done", coverPic });
};
