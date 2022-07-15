const createError = require("http-errors");

// errorHandler
function notFoundHandler(req, res, next) {
  next(createError(404, "Requested content was not found!"));
}

// defult error handler
function errorHandler(err, req, res, next) {
  console.log(err);
  res.locals.error =
    process.env.NODE_ENV === "development" ? err : { message: err.message };
  res.status(err.status || 500);

  if (!res.locals.html) {
    res.render("error", {
      title: "this is error page",
    });
  } else {
    res.json(res.locals.error);
  }
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
