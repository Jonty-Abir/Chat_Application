// external imports
const express = require("express");

// inetrnal imports
// uopload multiple form data
const avaterUpload = require("../middleWares/common/user/avatarUpload");
const {
  getUserController,
  addUserController,
  removeUser,
} = require("../controller/userController");
const decodedhtmlResponse = require("../middleWares/common/htmlDecodedResponse");
// validator middleware & validator-handaler middleware
const {
  addUserValidator,
  addValidatorHandler,
} = require("../middleWares/common/user/userValidator");
const { checkLogin } = require("../middleWares/common/checkLogin");

const router = express.Router();

// get route
router.get("/", decodedhtmlResponse(`Users`), checkLogin, getUserController);

// create route
router.post(
  "/",
  checkLogin,
  avaterUpload,
  addUserValidator,
  addValidatorHandler,
  addUserController
);
// delete route
router.delete("/:id", removeUser);

module.exports = router;
