require('dotenv').config();
// Importing the mongoose here
const mongoose = require('mongoose');

// Providing the mongo string to the const mongoURL
const mongoURL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}`;

// Connecting to the database
const connectToMongo = () => {
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
}

module.exports = connectToMongo;