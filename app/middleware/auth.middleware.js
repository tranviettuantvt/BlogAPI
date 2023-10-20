const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const User = require("../model/user.model");

// Catch token expired error in verify token
const catchError = (err, res) => {
  if (err instanceof jwt.TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }
  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided",
    });
  }

  // Verify accessToken
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

// Check if User is admin
exports.isAdmin = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (user.isAdmin) {
        next();
        return;
      }
      res.status(403).send({
        message: "Require Admin Role",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Blog.",
      });
    });
};
