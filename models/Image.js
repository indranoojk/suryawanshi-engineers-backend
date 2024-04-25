const mongoose = require("mongoose")

const imageSchema = mongoose.Schema({
    filename: { type: String, required: true },
    name: { type: Buffer, required: true },
    path: { type: String, required: true },
})

const Image = mongoose.model("webimg", imageSchema)

module.exports = Image;