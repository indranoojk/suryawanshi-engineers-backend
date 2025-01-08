const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// var fetchadmin = require('../middleware/fetchadmin');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './upload/images');
//   },
//   filename: (req, file, cb) => {
//     // cb(null, Date.now() + '-' + file.originalname);
//     cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// const upload = multer({ storage: storage });

// router.get("/image/:id", async (req, res) => {
//     // const {id} = req.params;
//     try {
//         const image = await Image.findById(id);
//         if(!image){
//             res.send({"msg": "Image Not Found"});
//         }

//         const imagePath = path.join(__dirname, "uploads", image.filename);
//         res.sendFile(imagePath);

//     } catch (error) {
//         res.send({"error": "Unable to get image"})
//     }
// })

// router.post('/upload', upload.single('project'), async (req, res) => {
//     try {
//         // console.log(req.file);
//         // const { path, filename } = req.file;
//         // const image = await Image({path, filename, admin: req.admin.id});
//         // const savedImage = await image.save();
//         // res.send({"msg": "Image Uploaded", imageId: savedImage._id});

//         res.json({
//             success: 1,
//             image_url: `http://localhost:5001/api/images/${req.file.filename}`
//         })
//     } catch (error) {
//         res.send({"error": "Unable to upload image"});
//     }
// })

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

router.post('/upload', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        // console.log(image);  //working properly
        const imageData = await cloudinary.uploader
            .upload(imageUrl)
            .catch((error) => {
                console.log(error);
            });
        console.log(imageData);
        let images = await Image.find({});
        let id;
        if (images.length > 0) {
            let last_image_array = images.slice(-1);
            let last_image = last_image_array[0];
            id = last_image.id + 1;
        }
        else {
            id = 1;
        }
        // Create a new Image instance with the URL
        const image = new Image({
            id: id,
            image_url: imageData.secure_url
        }); // Ensure the field name matches your schema
        const savedImageUrl = await image.save();

        // Send the response with the saved image URL
        res.json({
            success: true,
            image_url: imageData.secure_url, // Return the saved image URL
        });

    } catch (error) {
        res.send({ "error": `Unable to upload image: ${error}` });
    }
    // res.json({
    //     success: 1,
    //     image_url: `/images/${req.file.filename}`
    // })
    //     const file = req.files.image;
    //     const ImageData = await cloudinary.uploader
    //         .upload(file.tempFilePath)
    //         .catch((error) => {
    //             console.log(error);
    //         });
    //         console.log(ImageData);
    //     res.json({
    //         success: 1,
    //         image_url: ImageData.secure_url,
    //     })
})

module.exports = router