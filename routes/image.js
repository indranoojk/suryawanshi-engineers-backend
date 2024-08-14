const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const multer = require('multer');
const path = require('path');
var fetchadmin = require('../middleware/fetchadmin');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/src/assets/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single("image"), fetchadmin, async (req, res) => {
    try {
        // console.log(req.file);
        const { path, filename } = req.file;
        const image = await Image({path, filename, admin: req.admin.id});
        const savedImage = await image.save();
        res.send({"msg": "Image Uploaded", imageId: savedImage._id});
    } catch (error) {
        res.send({"error": "Unable to upload image"});
    }
})

router.get("/image/:id", fetchadmin, async (req, res) => {
    // const {id} = req.params;
    try {
        const image = await Image.findById(id);
        if(!image){
            res.send({"msg": "Image Not Found"});
        }

        const imagePath = path.join(__dirname, "uploads", image.filename);
        res.sendFile(imagePath);

    } catch (error) {
        res.send({"error": "Unable to get image"})
    }
})

module.exports = router