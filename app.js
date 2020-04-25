// load env variables
const env = require("dotenv").config();
//minimalist web framework for node
const express = require("express");
//request body parsing middleware.
const bodyParser = require("body-parser");
//package for cloudinary integration
const cloudinary = require("cloudinary");
//ODM for mongoDB (a NoSQL DB)
const mongoose = require("mongoose");
//create the app
const app = express();
//built-in module To handle file paths
// var path = require("path");
//built-in module To handle the file system
// var fs = require("fs");
//global object called __basedir scop is anywhere in the project
global.__basedir = __dirname;
// middleware that only parses json
app.use(bodyParser.json({ limit: "10mb", extended: true }));
//middleware that only parses urlencoded bodies
//
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

require("./routes/admin.route")(app);

app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

require("./routes/customer.route")(app);
require("./routes/caterer.route")(app);
require("./routes/menu.route")(app);
require("./routes/cart.route")(app);
require("./routes/order.route")(app);
app.get("/", (req, res) => {
  res.send("Welcome");
});
// Your Mongo Atlas Cluster
// Create a Project on Mongo Atlas and Create a Cluster and than configure it

const mongoDB = process.env.MONGODB_URI;
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected…");
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));

// Please create your account on cloudinary and find following keys from Dashboard.
// Make Sure you verified your account via Email after creating to work it properly.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
