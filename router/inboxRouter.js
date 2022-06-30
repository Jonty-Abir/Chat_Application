// external import
const express = require("express");
// internal import
const { getInboxController } = require("../controller/inboxController");
const { checkLogin } = require("../middleWares/common/checkLogin");

const htmlDecodedResponse = require("../middleWares/common/htmlDecodedResponse");

const router = express.Router();

router.get("/", htmlDecodedResponse("Inbox"), checkLogin, getInboxController);
module.exports = router;
