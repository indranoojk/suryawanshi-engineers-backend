require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const colors = require("colors");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

connectToMongo();

const app = express();

const port = process.env.PORT;
// const port = 3001;

// app.use(cors())
// const whitelist = ['https://suryawanshi-engineers.vercel.app', 'http://res.cloudinary.com']
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// app.use(cors({ origin: 'https://suryawanshi-engineers.vercel.app/' }))
app.use(cors({
  origin: ['https://suryawanshi-engineers.vercel.app', 'https://res.cloudinary.com/dm8ca7qod/image/upload'], // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Enable cookies and headers if required
}));
app.use(express.json())

app.use(bodyParser.json());
// app.use('/images', express.static("upload/images"));

app.use(fileUpload({
  useTempFiles: true,
}))

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ msg: "I am in home route" });
  } catch (error) {
    res.status(500).json({ msg: "Error in home route" });
  }
});

// app.get("/images", async (req, res) => {
//   try {
//     res.status(200).json({ msg: "I am in images route" });
//   } catch (error) {
//     res.status(500).json({ msg: "Error in images route" });
//   }
// });

app.use('/api/auth', require('./routes/auth'))
app.use('/api/contract', require('./routes/contract'))
app.use('/api/project', require('./routes/project'))
// app.use('/api/images', require('./routes/image'))


app.listen(port, async () => {
    // try {
    //     await connectToMongo;
    //     console.log(colors.bgYellow(`connectd to mongo db`));
    //   } catch (error) {
    //     console.log(colors.bgRed("Error in connecting mongoDb"));
    //   }
      console.log(colors.rainbow(`Backend is running on port ${port}`));
})