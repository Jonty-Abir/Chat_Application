// external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
// internal imports
const {
  errorHandler,
  notFoundHandler,
} = require("./middleWares/common/errorHandler");
const loginRouter = require("./router/loginRouter");
const inboxRouter = require("./router/inboxRouter");
const userRouter = require("./router/userRouter");
const app = express();
dotenv.config(); // read .env file

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.log(err.message);
  });

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

// error handler
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server listening port ${process.env.PORT}`);
});
