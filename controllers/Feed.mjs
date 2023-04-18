import { validationResult } from "express-validator";
import { PostModel } from "../models/FeedModel.mjs";

const getPosts = (req, res, next) => {
  PostModel.find()
    .then((posts) => {
      if (!posts) {
        const error = new Error("No posts was found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Fetched successfully",
        posts,
      });
    })
    .catch((error) => {
      if (!error.statusCode) statusCode = 500;
      next(error);
    });
};

const createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\", "/");
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

  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const post = new PostModel({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: {
      name: "Adam Ananda Santoso",
    },
  });

  post
    .save()
    .then((data) => {
      res.status(201).json({
        message: "Success to created post",
        post: data,
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
      console.log({ post });
      console.log({ post: post });
      res.status(200).json({ message: "Post fetched", post });
    })
    .catch((error) => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    });
};

export { getPosts, createPost, getPost };
