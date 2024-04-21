const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContractSchema = new Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    query: {
        type: String,
        default: "None"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Contract = mongoose.model('contract', ContractSchema);
module.exports = Contract;