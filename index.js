require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();
const app = express();

// Using port 5000 because our react app will run on port 3000
const port = process.env.PORT;

app.use(cors())
app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('hello world, this is me')
// })

// // Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/contract', require('./routes/contract'))

app.listen(port, () => {
    console.log(`Suryawanshi backend listening on http://localhost:${port}`)
})