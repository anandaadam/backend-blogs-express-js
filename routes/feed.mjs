import express from "express";
import * as FeedController from "../controllers/Feed.mjs";

const router = express.Router();

router.get("/posts", FeedController.getPosts);
router.post("/post", FeedController.createPost);

export { router };
