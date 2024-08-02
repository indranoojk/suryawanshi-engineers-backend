const mongoose = require("mongoose")

const imageSchema = mongoose.Schema({
    name: String,
    imageUrl: String
})

const Image = mongoose.model("Image", imageSchema)

module.exports = Image;