// external imports

// internal imports
const uploader = require("../../../utilities/multipleUploder");

function attachmentUploader(req, res, next) {
  const upload = uploader(
    "attachments",
    ["image/jpeg", "image/jpg", "image/png"],
    10000000,
    2,
    "Only .jpg .png .jpeg formats are suported!"
  );
  // call  the middleware fun

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = attachmentUploader;
