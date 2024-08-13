require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const colors = require("colors");
const bodyParser = require('body-parser');

connectToMongo();

const app = express();

// const port = process.env.PORT;
const port = 3001;

app.use(cors())
app.use(express.json())

app.use(bodyParser.json());
app.use(express.static("uploads"));

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ msg: "I am in home route" });
  } catch (error) {
    res.status(500).json({ msg: "Error in home route" });
  }
});

app.use('/api/auth', require('./routes/auth'))
app.use('/api/contract', require('./routes/contract'))
app.use('/api/project', require('./routes/project'))
app.use('/api/image', require('./routes/image'))


app.listen(port, async () => {
    // try {
    //     await connectToMongo;
    //     console.log(colors.bgYellow(`connectd to mongo db`));
    //   } catch (error) {
    //     console.log(colors.bgRed("Error in connecting mongoDb"));
    //   }
      console.log(colors.rainbow(`Backend is running on port ${port}`));
})