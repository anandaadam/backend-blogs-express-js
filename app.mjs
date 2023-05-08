import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import * as feedRoutes from "./routes/feed.mjs";
import * as authRoutes from "./routes/auth.mjs";
import * as statusRoutes from "./routes/status.mjs";
import socket from "./socket.mjs";
import __dirname from "./utils/path.mjs";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "../", "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes.router);
app.use("/feed", feedRoutes.router);
app.use(statusRoutes.router);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log(error);
  res.status(statusCode).json({ message, data });
});

mongoose
  .connect(
    "mongodb://adam:Pknqsx123.@ac-4st63nd-shard-00-00.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-01.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-02.myiaxw1.mongodb.net:27017/blogs?replicaSet=atlas-10elfg-shard-0&ssl=true&authSource=admin"
  )
  .then((result) => {
    const server = app.listen(3001);
    // const io = new Server(server, {
    //   cors: {
    //     origin: "http://localhost:3000",
    //     methods: ["GET", "POST"],
    //   },
    // });
    const io = socket.init(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((error) => console.log(error));
