// external imports
const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
// internal imports
const Users = require("../models/people");

function getLoginController(req, res, next) {
  res.render("index");
}

async function login(req, res, next) {
  try {
    const user = await Users.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });
    //console.log(user);
    if (user && user._id) {
      const isValidPassword = await bycript.compare(
        req.body.password,
        user.password
      );
      if (isValidPassword) {
        const userObject = {
          userid: user._id,
          username: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role || "user,",
        };
        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        // set cookie
        res.cookie(process.env.COOKIC_NAME, token, {
          maxAge: process.env.JWT_EXPIRE,
          httpOnly: true,
          signed: true,
        });

        // set logged in user local identifire
        res.locals.loggedInUser = userObject;

        res.redirect("inbox");
      } else {
        throw createError("Login Falid! Please try again.");
      }
    } else {
      throw createError("Login Falid! Please try again.");
    }
  } catch (err) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// do logOut
function logOut(req, res) {
  console.log("Hey i am clear Your cookie.");
  res.clearCookie(process.env.COOKIC_NAME);
  res.send("loged out!");
}

module.exports = {
  getLoginController,
  login,
  logOut,
};
