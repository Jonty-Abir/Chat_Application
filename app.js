// external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const moment = require("moment");
const cookieParser = require("cookie-parser");
// internal imports
const {
  errorHandler,
  notFoundHandler,
} = require("./middleWares/common/errorHandler");
const loginRouter = require("./router/loginRouter");
const inboxRouter = require("./router/inboxRouter");
const userRouter = require("./router/userRouter");
const errorRouter = require("./router/errorRouter");
const app = express();

// for socket
const server = http.createServer(app);

dotenv.config(); // read .env file

const io = require("socket.io")(server);
global.io = io;

app.locals.moment = moment;

// Database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.log(err.message);
  });
// re quest parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");
// static folder
app.use(express.static(path.join(__dirname, "public")));
// use sign cookie
app.use(cookieParser(process.env.COOKIC_SECRET));
// router handller
app.use("/", loginRouter);
app.use("/inbox", inboxRouter);
app.use("/users", userRouter);
app.use("/error", errorRouter);

// error handler
app.use(notFoundHandler);
app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Server listening port ${process.env.PORT}`);
});
