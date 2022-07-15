// external import
const express = require("express");
// internal import

const {
  getInboxController,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  removeMessage,
  searchConversation,
} = require("../controller/inboxController");
const { checkLogin } = require("../middleWares/common/checkLogin");

const htmlDecodedResponse = require("../middleWares/common/htmlDecodedResponse");
const attachmentUploader = require("../middleWares/common/inbox/attachmentUpload");

const router = express.Router();

router.get("/", htmlDecodedResponse("Inbox"), checkLogin, getInboxController);

// search user
router.post("/search", checkLogin, searchUser);

// for searching conversations
router.post("/searchCoversation", searchConversation);

// for add conversation
router.post("/conversation", checkLogin, addConversation);

//for get messages
router.get("/messages/:conversation_id", checkLogin, getMessages);

// for attachment
router.post("/message", checkLogin, attachmentUploader, sendMessage);
router.delete("/msg:id", removeMessage);

module.exports = router;
