const Image = require('../models/Image');
const uploadImage = require('./upload');

const saveImage = async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  try {
    const imageUrl = await uploadImage(file);
    const image = new Image({ name, imageUrl });
    await image.save();

    res.send('Image uploaded successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading image');
  }
};

const getImage = async (req, res) => {
  const imageId = req.params.id;

  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).send('Image not found');
    }

    res.json(image);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving image');
  }
};

module.exports = { saveImage, getImage };
