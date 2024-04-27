const multer = require("multer");

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${Date.now()}-${
      req.body.email
    }${file.originalname.slice(-4)}`;
    cb(null, uniqueFileName);
  },
});

module.exports = Storage;
