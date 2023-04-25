import express from "express";
import { body } from "express-validator";
import * as StatusController from "../controllers/Status.mjs";
import { UserModel } from "../models/UserModel.mjs";
import isAuth from "../middleware/isAuth.mjs";

const router = express.Router();

router.get("/status", isAuth, StatusController.getStatus);
router.put(
  "/status",
  isAuth,
  body("status").trim().isLength({ min: 3 }),
  StatusController.updateStatus
);

export { router };
