// external import
const express = require("express");

// internal imports
const { getLoginController } = require("../controller/loginController");
const htmlDecodedResponse = require("../middleWares/common//htmlDecodedResponse");

const router = express.Router();

router.get("/", htmlDecodedResponse("Login"), getLoginController);
module.exports = router;
