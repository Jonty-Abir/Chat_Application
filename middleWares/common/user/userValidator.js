// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");
// internal imports
const Users = require("../../../models/people");

const addUserValidator = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("name is require!")
    .isAlpha("en-US", {
      ignore: " -",
    })
    .withMessage("name must not contain anything other then alphabet.")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await Users.findOne({ email: value });
        if (user) {
          console.log(user);
          throw createError("Email already use!");
        }
      } catch (err) {
        //console.log(err);
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("en-IN", { strictMode: true })
    .withMessage("Mobile number must be valid a indian mobile number!")
    .custom(async (value) => {
      try {
        const user = await Users.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile number already use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase 1 upercase 1 number 1 symbol"
    ),
];

function addValidatorHandler(req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  /* like this formart
  mappedErrors:{
    name:{
        msg: 'name is require.'
    },
    email:{
        msg:'email is invalid.'
    }
  } 
  */
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files.length > 0) {
      // multer put the uploaded file in req.files
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `../../../public/uploads/avater/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }
    // response the error
    res.status(500).json({
      errors: mappedErrors,
    });
  }
}

module.exports = {
  addUserValidator,
  addValidatorHandler,
};
