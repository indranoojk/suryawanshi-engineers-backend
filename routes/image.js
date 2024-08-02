const express = require('express');
const multer = require('multer'); // For handling file uploads
const imagesController = require('./images.controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Modify the destination path accordingly

router.post('/images', upload.single('image'), imagesController.saveImage);
router.get('/images/:id', imagesController.getImage);

module.exports = router;
