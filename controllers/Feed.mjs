import { validationResult } from "express-validator";
import { PostModel } from "../models/FeedModel.mjs";

const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/duck.jpg",
        creator: {
          name: "Adam Ananda Santoso",
        },
        createdAt: new Date(),
      },
    ],
  });
};

const createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
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

  const post = new PostModel({
    title: title,
    imageUrl: "1",
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

export { getPosts, createPost };
