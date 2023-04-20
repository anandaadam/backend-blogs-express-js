import express from "express";
import { body } from "express-validator";
import * as FeedController from "../controllers/Feed.mjs";
import isAuth from "../middleware/isAuth.mjs";

const router = express.Router();

router.get("/posts", isAuth, FeedController.getPosts);
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  FeedController.createPost
);
router.get("/post/:postId", isAuth, FeedController.getPost);
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  FeedController.updatePost
);
router.delete("/post/:postId", isAuth, FeedController.deletePost);

export { router };
