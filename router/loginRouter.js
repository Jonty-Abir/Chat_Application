// external import
const express = require("express");

// internal imports
//  controllers
const {
  getLoginController,
  login,
  logOut,
} = require("../controller/loginController");
// validators
const {
  doLoginValidator,
  doLoginValidationHandler,
} = require("../middleWares/common/login/loginValodator");

const htmlDecodedResponse = require("../middleWares/common/htmlDecodedResponse");
const { redirectLoggedIn } = require("../middleWares/common/checkLogin");

const router = express.Router();
// get
const page_title = "Login";

router.get(
  "/",
  htmlDecodedResponse(page_title),
  redirectLoggedIn,
  getLoginController
);
// process login
router.post(
  "/",
  htmlDecodedResponse(page_title),
  doLoginValidator,
  doLoginValidationHandler,
  login
);
// delete
router.delete("/", logOut);

module.exports = router;
