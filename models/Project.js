const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
    // admin: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'admin'
    // },
    id: { 
        type: Number, 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model('project', ProjectSchema);
module.exports = Project;