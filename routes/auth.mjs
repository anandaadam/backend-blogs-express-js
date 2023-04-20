import express from "express";
import { body } from "express-validator";
import { UserModel } from "../models/UserModel.mjs";
import * as AuthController from "../controllers/Auth.mjs";

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return UserModel.findOne({ email: value }).then((userDoc) => {
          if (userDoc) return Promise.reject("Email already exists");
        });
      })
      .normalizeEmail(),
    body("name").trim(),
    body("password").trim().isLength({ min: 5 }),
  ],
  AuthController.signup
);

router.post("/login", AuthController.login);

export { router };
