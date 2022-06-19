// external import
const express = require("express");
// internal import
const { getInboxController } = require("../controller/inboxController");
const htmlDecodedResponse = require("../middleWares/common//htmlDecodedResponse");
const router = express.Router();
router.get("/", htmlDecodedResponse("Inbox"), getInboxController);
module.exports = router;
