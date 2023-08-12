import { expect } from "chai";
import sinon from "sinon";

import { UserModel } from "../models/UserModel.mjs";
import * as AuthController from "../controllers/Auth.mjs";

describe("Auth Login Controller", function () {
  it("should throw an error with code 500 if accessing the database fails", function (done) {
    sinon.stub(UserModel, "findOne");
    UserModel.findOne.throws();

    const req = {
      body: {
        email: "adam@gmail.com",
        password: "123",
      },
    };

    AuthController.login(req, {}, () => {})
      .then((result) => {
        console.log(result.statusCode);
        expect(result).to.be.an("Error");
        expect(result).to.have.property("statusCode", 500);
        done();
      })
      .catch((error) => {
        done(error);
      });

    UserModel.findOne.restore();
  });
});
