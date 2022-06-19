// external imports
const express = require("express");
// inetrnal imports
const { getUserController } = require("../controller/userController");
const decodedhtmlResponse = require("../middleWares/common/htmlDecodedResponse");

const router = express.Router();

router.get("/", decodedhtmlResponse(`Users`), getUserController);
module.exports = router;
