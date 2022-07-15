const express = require("express");

const router = express.Router();

async function errorRouter(req, res, next) {
  res.render("error", {
    title: "this erroe page",
    error: "it your error",
    message: "err",
    status: "500",
    stack: "stack",
  });
}

router.get("/", errorRouter);

module.exports = router;
