import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";

import { UserModel } from "../models/UserModel.mjs";
import * as StatusController from "../controllers/Status.mjs";

describe("User Status Controller", function () {
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
  it("should send a response with a valid user status for an existing user", function (done) {
    const req = { userId: "5c0f66b979af55031b34728a" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.userStatus = data.status;
      },
    };

    StatusController.getStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("I'm new");
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
