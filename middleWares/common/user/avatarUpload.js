// external improts
const uploader = require("../../../utilities/singleUploder");

function avaterUpload(req, res, next) {
  const upload = uploader(
    "avater",
    ["image/jpeg", "image/jpg", "image/png"],
    10000000,
    "only jpg jpeg png format suported"
  );
  // err handal without passing our defult handaler
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avater: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = avaterUpload;
