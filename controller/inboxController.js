// external imports
const createError = require("http-errors");
const { join } = require("path");
const { unlink } = require("fs");
// internal import
const User = require("../models/people");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const escape = require("../utilities/escape");

async function getInboxController(req, res, next) {
  //console.log(req.user.userid, "jonty");
  try {
    const conversation = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });
    //console.log(conversation.length, "jonty");
    // get message detalis
    const getMsg = await Message.find({});
    let dataMsg = getMsg.length;
    res.locals.msgLength = dataMsg;
    let msgId;
    // console.log(data1, "getMesage");

    getMsg.forEach((data) => {
      msgId = data._id.toString();
      // console.log(msgId);
    });
    if (msgId) {
      res.locals.msgId = msgId;
    } else {
      res.status(500).json({
        errors: {
          common: {
            msg: "Unknown error was occure!",
          },
        },
      });
    }
    conversation.forEach((data) => {
      res.locals.rowConData = data.id;
    });

    res.locals.data = conversation;
    res.locals.dataLength = conversation.length;
    // console.log(conversation);
    res.render("inbox");
  } catch (err) {
    console.log(err);
    res.render("error", {
      error: {
        message: err.message,
        status: 404,
        stack: err.stack,
      },
    });
    // next(err);
  }
}

async function searchUser(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+91", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp(escape("+91" + searchQuery));
  const email_search_regex = new RegExp(escape(searchQuery) + "$", "i");

  try {
    if (searchQuery !== "") {
      const users = await User.find(
        {
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
          ],
        },
        "name avatar"
      );
      // console.log(users);
      res.json(users);
    } else {
      throw createError("You moust provide some text for search.");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.Message,
        },
      },
    });
  }
}
// add conversation

async function addConversation(req, res, next) {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        id: req.body.id,
        name: req.body.participant,
        avatar: req.body.avatar || null,
      },
    });
    const result = await newConversation.save();
    res.status(200).json({
      message: "Coversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// get message of a conbersation
async function getMessages(req, res, next) {
  try {
    // console.log(req.user, "abir");
    // hole conversation
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");
    // only participant
    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          message: "Unknows error occures!",
        },
      },
    });
  }
}

// send new message
async function sendMessage(req, res, next) {
  //console.log(req.body, "abir from server");
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });
      const result = await newMessage.save();

      //emit socket event
      global.io.emit("newMessage", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid,
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });
      res.status(200).json({
        message: "Successfull",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "Message Text or attachment is require!",
      },
    });
  }
}

async function removeMessage(req, res, next) {
  // console.log("abir");
  try {
    const getConversationId = await Message.findByIdAndDelete({
      _id: `${req.params.id}`,
    });
    let fullPath;
    let getAttachment;

    // console.log(getConversationId, "removeMessage");
    const pathArray = getConversationId.attachment;

    if (getConversationId.attachment) {
      //console.log("its work");
      pathArray.forEach((v) => {
        fullPath = v;
      });
      // inner forech for attachment

      unlink(
        join(__dirname, `../public/uploads/attachments/${fullPath}`),
        (err) => {
          console.log(err, "form Unlink error");
        }
      );
      res
        .status(200)
        .json({ msg: "Messages & Attachment was deleted successfully.!" });
    } else {
      res.status(200).json({ msg: "Messages was deleted successfully.!" });
    }
  } catch (err) {
    console.log(err, "form message delete");
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete messages.!",
        },
      },
    });
  }
}
// todo
async function searchConversation(req, res, next) {
  const conversation = req.body.conversation;

  const searchQuery = conversation.replace("+91", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp(escape("+91" + searchQuery));
  const email_search_regex = new RegExp(escape(searchQuery) + "$", "i");

  try {
    let participantDetails;
    let conversationId;
    if (searchQuery !== "") {
      const conversationDb = await Conversation.find({
        $or: [
          {
            name: name_search_regex,
          },
        ],
      });
      //console.log(conversationDb._id);
      conversationDb.forEach((v) => {
        if (v.participant.name === conversation) {
          participantDetails = v.participant;
          conversationId = v._id;
        }
      });
      res.json({
        participantDetails,
        conversationId,
      });
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Conversation was not found",
        },
      },
    });
  }
}

module.exports = {
  getInboxController,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  removeMessage,
  searchConversation,
};
