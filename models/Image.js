const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    // admin: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'admin'
    // },
    // path: {
    //     type: String,
    //     required: true
    // },
    // filename: {
    //     type: String,
    //     required: true
    // },
    id: { 
        type: Number, 
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Image = mongoose.model('image', ImageSchema);
module.exports = Image;