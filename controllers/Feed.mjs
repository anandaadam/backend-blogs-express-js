import path from "path";
import fs from "node:fs";
import __dirname from "../utils/path.mjs";
import { validationResult } from "express-validator";
import { PostModel } from "../models/FeedModel.mjs";
import { UserModel } from "../models/UserModel.mjs";
import { count } from "console";

const getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  try {
    const postModel = await PostModel.find().countDocuments();
    const posts = await PostModel.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (!posts) {
      const error = new Error("No posts was found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Fetched successfully",
      posts,
      totalItems,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

const createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\", "/");
  const errors = validationResult(req);
  let creator;

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const post = new PostModel({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: req.userId,
  });

  post
    .save()
    .then((result) => {
      return UserModel.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Success to created post",
        post: post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((error) => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    });
};

const getPost = (req, res, next) => {
  const postId = req.params.postId;
  PostModel.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No post was found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetched", post });
    })
    .catch((error) => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    });
};

const updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;

    // return res.status(422).json({
    //   message: "Validation failed",
    //   errors: errors.array(),
    // });
  }

  if (req.file) {
    // imageUrl = req.file.path;
    imageUrl = req.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    const error = new Error("No image");
    error.statusCode = 422;
    throw error;
  }

  PostModel.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No post found");
        error.statusCode = 422;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("No authorized");
        error.statusCode = 403;
        throw error;
      }

      if (imageUrl !== post.imageUrl) clearImage(post.imageUrl);

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updatetd", post: result });
    })
    .catch((error) => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    });
};

const deletePost = (req, res, next) => {
  const postId = req.params.postId;

  PostModel.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No post found");
        error.statusCode = 422;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("No authorized");
        error.statusCode = 403;
        throw error;
      }

      clearImage(post.imageUrl);
      return PostModel.findByIdAndRemove(postId);
    })
    .then((result) => {
      return UserModel.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post deleted" });
    })
    .catch((error) => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "../", filePath);
  fs.unlink(filePath, (error) => {
    console.log(error);
  });
};

export { getPosts, createPost, getPost, updatePost, deletePost };
