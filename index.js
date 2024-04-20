require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const colors = require("colors");
const { AdminRouter } = require('./routes/auth')
const { ContractRouter } = require('./routes/contract')
const { auth } = require('./middleware/fetchadmin')

connectToMongo();
const app = express();

// Using port 5000 because our react app will run on port 3000
const port = process.env.PORT;

app.use(cors())
app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('hello world, this is me')
// })


app.use("/admin", AdminRouter);


// // Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/contract', require('./routes/contract'))


app.use(auth)

app.use("/admin", AdminRouter);


app.listen(port, async () => {
    try {
        await connectToMongo;
        console.log(colors.bgYellow(`connectd to mongo db`));
      } catch (error) {
        console.log(colors.bgRed("Error in connecting mongoDb"));
      }
      console.log(colors.rainbow(`Backend is running on port ${port}`));
})