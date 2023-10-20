const authConfig = require("../config/auth.config");
const { verifyRefreshToken } = require("../utils");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../model/refreshToken.model");

exports.createAccessToken = async (req, res) => {
  try {
    const { tokenDecoded } = await verifyRefreshToken(req.body.refreshToken);

    // Create new accessToken
    const payload = { id: tokenDecoded._id, email: tokenDecoded.email };
    const accessToken = jwt.sign(payload, authConfig.secret, {
      expiresIn: "5m",
    });

    res.status(200).json({
      accessToken,
      message: "Access token created successfully",
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // Remove refreshTOken out of db
    const refreshToken = await RefreshToken.findOneAndRemove({
      token: req.body.refreshToken,
    });
    if (!refreshToken) {
      return res
        .status(200)
        .json({ error: false, message: "Logged Out Successfully" });
    }

    res.status(200).json({ error: false, message: "Logged Out Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
