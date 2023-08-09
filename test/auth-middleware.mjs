import { expect } from "chai";
import isAuth from "../middleware/isAuth.mjs";

import jwt from "jsonwebtoken";
import sinon from "sinon";

describe("Auth Middleware", function () {
  it("should throw an error if no authorization header is present", function () {
    const req = {
      get(headerName) {
        return null;
      },
    };

    const sum = function (value) {
      return value;
    };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw("No authenticated");
  });

  it("should throw an error if the authorization header is only one string", function () {
    const req = {
      get(headerName) {
        return "xyz";
      },
    };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", function () {
    const req = {
      get(headerName) {
        return "Bearer xyz";
      },
    };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", function () {
    const req = {
      get(headerName) {
        return "Bearer xyz";
      },
    };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });

    isAuth(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");

    jwt.verify.restore();
    // expect(isAuth.bind(this, req, {}, () => {})).to.have.property("userId");
  });
});
