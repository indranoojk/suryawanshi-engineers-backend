const express = require('express');
const colors = require("colors");
const connectToMongo = require('./db');
var cors = require('cors');
const { AdminRouter } = require('./routes/auth');
const { ContractRouter } = require('./routes/contract');
const { fetchadmin } = require('./middleware/fetchadmin');
require('dotenv').config();

const app = express();

const port = process.env.PORT;

app.use(cors())
app.use(express.json())


app.use("/admin", AdminRouter);


app.use('/api/auth', require('./routes/auth'))
app.use('/api/contract', require('./routes/contract'))


app.use(fetchadmin)

app.use("/contract", ContractRouter);


app.listen(port, async () => {
    try {
        await connectToMongo;
        console.log(colors.bgYellow(`connectd to mongo db`));
      } catch (error) {
        console.log(colors.bgRed("Error in connecting mongoDb"));
      }
      console.log(colors.rainbow(`Backend is running on port ${port}`));
})