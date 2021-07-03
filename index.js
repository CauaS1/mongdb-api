
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require('./src/routes/users');
const authRoute = require('./src/routes/auth');

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

app.listen(5500, () => console.log('Running'));