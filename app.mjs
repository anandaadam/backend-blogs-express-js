import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as feedRoutes from "./routes/feed.mjs";
import __dirname from "./utils/path.mjs";

const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "../", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes.router);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  res.status(statusCode).json({ message });
});

mongoose
  .connect(
    "mongodb://adam:Pknqsx123.@ac-4st63nd-shard-00-00.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-01.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-02.myiaxw1.mongodb.net:27017/blogs?replicaSet=atlas-10elfg-shard-0&ssl=true&authSource=admin"
  )
  .then((result) => app.listen(3001))
  .catch((error) => console.log(error));
