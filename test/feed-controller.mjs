import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";

import { UserModel } from "../models/UserModel.mjs";
import * as StatusController from "../controllers/Status.mjs";
import * as FeedController from "../controllers/Feed.mjs";

describe("Feed Controller", function () {
  before(function (done) {
    mongoose
      .connect(
        "mongodb://adam:Pknqsx123.@ac-4st63nd-shard-00-00.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-01.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-02.myiaxw1.mongodb.net:27017/blogs-test?replicaSet=atlas-10elfg-shard-0&ssl=true&authSource=admin"
      )
      .then((result) => {
        const user = new UserModel({
          email: "adam@gmail.com",
          password: "123",
          name: "Adam",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });

        return user.save();
      })
      .then(() => done())
      .catch((error) => done(error));
  });

  it("should add a acreated post to the posts of the creator", function (done) {
    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
        path: "abc",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {})
      .then((savedUser) => {
        expect(savedUser).to.have.property("posts");
        expect(savedUser.posts).to.have.length(1);
        done();
      })
      .catch((error) => done(error));
  });

  after(function (done) {
    UserModel.deleteMany({})
      .then(() => mongoose.disconnect())
      .then(() => done())
      .catch((error) => done(error));
  });
});
