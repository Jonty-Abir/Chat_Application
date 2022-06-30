// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const { join } = require("path");

//internal imports
const Users = require("../models/people");

async function getUserController(req, res, next) {
  const users = await Users.find();
  //console.log(users.forEach((user) => console.log(user.name)));
  try {
    res.render("users", {
      users: users,
    });
  } catch (err) {
    next(err);
  }
}

async function addUserController(req, res, next) {
  let newUser;
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  if (req.files && req.files.length > 0) {
    newUser = new Users({
      ...req.body,
      avater: req.files[0].filename,
      password: hashPassword,
    });
  } else {
    newUser = new Users({
      ...req.body,
      password: hashPassword,
    });
  }
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successful.",
    });
  } catch (err) {
    if (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: "Unknown error occured!",
          },
        },
      });
    }
  }
}

async function removeUser(req, res, next) {
  try {
    const user = await Users.findByIdAndDelete({
      _id: req.params.id,
    });

    // remove error
    if (user.avater) {
      unlink(
        join(__dirname, `../public/uploads/avater/${user.avater}`),
        (err) => {
          if (err) {
            console.log(err, "Known error occure");
          }
        }
      );
    } else {
      res.status(200).json({ msg: "User was remove successfuly!" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}

module.exports = {
  getUserController,
  addUserController,
  removeUser,
};
