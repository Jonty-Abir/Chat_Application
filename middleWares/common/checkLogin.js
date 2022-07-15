// external imports
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

// internal imports

const checkLogin = async (req, res, next) => {
  let cookie =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (cookie) {
    try {
      token = cookie[process.env.COOKIC_NAME];
      // console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //console.log(decoded, "decoded");
      // console.log(res.locals.html);
      req.user = decoded;
      // parse user info to locals
      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (err) {
      if (res.locals.html) {
        res.redirect("/");
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: "Authentication Failure.",
            },
          },
        });
      }
    }
  } else {
    if (res.locals.html) {
      res.redirect("/");
    } else {
      res.status(401).json({
        errors: "Authentication Failure.",
      });
    }
  }
};

const redirectLoggedIn = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (!cookies) {
    next();
  } else {
    res.redirect("/inbox");
  }
};

function requireRole(role) {
  return function (req, res, next) {
    if (req.user.role && role.includes(req.user.role)) {
      next();
    } else {
      if (res.locals.html) {
        next(createError("Only Admin can access this route.!"));
      } else {
        res.status(401).json({
          errors: {
            common: {
              msg: "Only Admin can access this route.!",
            },
          },
        });
      }
    }
  };
}
/*
async function setAllLocals(req,res,next){
  try{ // get message detalis
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
  }catch(err){

  }
} */

module.exports = { checkLogin, redirectLoggedIn, requireRole };
