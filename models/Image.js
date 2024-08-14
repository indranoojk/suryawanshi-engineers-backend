const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    path: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
});

const ImageModel = mongoose.model("images", ImageSchema);
module.exports = ImageModel;