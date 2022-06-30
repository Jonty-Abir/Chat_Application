// external imports

function decodedhtmlResponse(title_page) {
  return (req, res, next) => {
    res.locals.html = true;
    res.locals.title = `${title_page}_${process.env.APP_NAME}`;
    res.locals.loggedInUser = {};
    res.locals.data = {};
    res.locals.errors = {};
    next();
  };
}
module.exports = decodedhtmlResponse;
