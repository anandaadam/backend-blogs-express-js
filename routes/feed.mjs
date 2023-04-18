import express from "express";
import { body } from "express-validator";
import * as FeedController from "../controllers/Feed.mjs";

const router = express.Router();

router.get("/posts", FeedController.getPosts);
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  FeedController.createPost
);
router.get("/post/:postId", FeedController.getPost);
router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  FeedController.updatePost
);
router.delete("/post/:postId", FeedController.deletePost);

export { router };
