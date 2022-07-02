// external imports
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
const jwt = require("jsonwebtoken");

// internal imports

const checkLogin = (req, res, next) => {
  let cookie =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (cookie) {
    try {
      token = cookie[process.env.COOKIC_NAME];
      // console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //console.log(decoded, "decoded");
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
  if (!cookies) {
    next();
  } else {
    res.redirect("/inbox");
  }
};

module.exports = { checkLogin, redirectLoggedIn };
