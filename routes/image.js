const express = require("express")
const Image = require("../models/Image")
const multer = require('multer');
const path = require('path');

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `../Images`)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix  + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })



router.post("/upload", upload.single('image')  ,async(req, res)=>{
    var img = fs.readFileSync(req.file.path);

    var encode_image = img.toString('base64');

    // Define a JSON Object for the image
    
    var finalImage = {
      contentType: req.file.mimetype,
      path: req.file.path,
      image: new Buffer(encode_image, 'base64')
    };

    // insert the image to the database

    db.collection('image').insertOne(finalImage, (err, result) => {
      console.log(result);

      if(err) return console.log(err)
      
      console.log("Saved to database");
    })
})

router.get("/image/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const img = await Image.findById(id);

        if (!img) {
            return res.status(404).json({ msg: "Image not found", success: false });
        }

        const imagePath = path.join(__dirname, 'Images', img.filename);
        res.sendFile(imagePath);

    } catch (error) {
        res.status(500).json({ msg: `Image NOT Found`, success: false });
    }
});

module.exports = router