// upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'E:\React Course\suryawanshi\frontend\src\assets\images/'); // Change this to your desired upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Create unique filenames
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
