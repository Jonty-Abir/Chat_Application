// external imports
const { check, validationResult } = require("express-validator");
// internal imports

const doLoginValidator = [
  check("username")
    .isLength({
      min: 1,
    })
    .withMessage("Mobile number or Email is required."),
  check("password")
    .isLength({
      min: 1,
    })
    .withMessage("Password is required."),
];

function doLoginValidationHandler(req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: mappedErrors,
    });
  }
}

module.exports = {
  doLoginValidator,
  doLoginValidationHandler,
};
