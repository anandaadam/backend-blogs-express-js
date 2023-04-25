import { UserModel } from "../models/UserModel.mjs";
import { validationResult } from "express-validator";

const getStatus = (req, res, next) => {
  UserModel.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("No user found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: "Success", status: user.status });
    })
    .catch((error) => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    });
};

const updateStatus = (req, res, next) => {
  const status = req.body.status;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }

  UserModel.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("No user found");
        error.statusCode = 404;
        throw error;
      }

      user.status = status;
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "success" });
    })
    .catch((error) => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    });
};

export { getStatus, updateStatus };
