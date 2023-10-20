const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const RefreshToken = require("../model/refreshToken.model");

exports.generateTokens = async (user) => {
  try {
    // Generate Tokens
    const payload = { id: user._id, email: user.email };
    const accessToken = jwt.sign(payload, authConfig.secret, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign(payload, authConfig.refreshSecret, {
      expiresIn: "1h",
    });


    // Remove refreshToken out of Db if already have 
    const refreshTokenDB = await RefreshToken.findOneAndRemove({ user: user._id });

    // Save refreshToken into its db
    await new RefreshToken({ user: user._id, token: refreshToken }).save();

    // Return promise of Tokens
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};


// Check if refreshToken is valid
exports.verifyRefreshToken = async (refreshToken) => {
  try {
    const data = await RefreshToken.findOne({ token: refreshToken });

    if (!data) {
      throw { error: true, message: "Invalid Refresh Token" };
    }

    const tokenDecoded = await jwt.verify(
      refreshToken,
      authConfig.refreshSecret
    );
    return {
      tokenDecoded,   // User information
      error: false,
      message: "Valid Refresh token",
    };
  } catch (err) {
    throw { error: true, message: "Invalid refresh token" };
  }
};
