const authConfig = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const User = require("../model/user.model");

exports.signup = async (req, res) => {
  const { email, username, password, isAdmin } = req.body;
  const verifyEmail = await User.findOne({ email: email });
  try {
    if (verifyEmail) {
      return res.status(403).json({
        message: "Email already used",
      });
    } else {
      const user = new User({
        email,
        username,
        password: bcrypt.hashSync(password, 8),
        isAdmin,
      });

      user
        .save()
        .then((response) => {
          return res.status(201).json({
            message: "user successfully created!",
            result: response,
            success: true,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error.message,
          });
        });
    }
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).json({
          message: "Password is wrong",
        });
      }

      const token = jwt.sign(
        { email: user.email, id: user.id },
        authConfig.secret,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        accessToken: token,
        id: user._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        messgae: err.message,
        success: false,
      });
    });
};
