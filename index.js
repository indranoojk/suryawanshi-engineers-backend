require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const colors = require("colors");

connectToMongo();
const app = express();

const port = process.env.PORT;

app.use(cors())
app.use(express.json())



app.use('/api/auth', require('./routes/auth'))
app.use('/api/contract', require('./routes/contract'))



app.listen(port, async () => {
    try {
        await connectToMongo;
        console.log(colors.bgYellow(`connectd to mongo db`));
      } catch (error) {
        console.log(colors.bgRed("Error in connecting mongoDb"));
      }
      console.log(colors.rainbow(`Backend is running on port ${port}`));
})