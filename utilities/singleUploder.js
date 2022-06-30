// external imports
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

function uploader(sub_folderPath, allowed_file_type, max_fileSize, error_msg) {
  const Upload_folder = `${__dirname}/../public/uploads/${sub_folderPath}/`;
  // multer disk
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, Upload_folder);
    },
    filename: function (req, file, cb) {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname.replace(fileExt, "").split(" ").join("-") +
        "-" +
        Date.now();
      cb(null, filename + fileExt);
    },
  });
  // multer upload obj
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_fileSize,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_type.includes(file.mimetype)) {
        // console.log(file);
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });
  // return the final multer upload object
  return upload;
}

module.exports = uploader;
