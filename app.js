const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const mongoose = require("mongoose");
const config = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();



// connections params 
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// connect to database
mongoose
  .connect(config.database, connectionParams)
  // on connection
  .then(function (db) {
    console.log("Connected to database Successfully ");
  })
  // on error
  .catch((err) => {
    console.log("database connection error " + err);
  });

// initialize express
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,enctype,Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// Express Validator
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      const namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// routes
const index = require("./routes/index");
const task = require("./routes/task");


// entry points
app.use("/", index);
app.use("/api", task);


// Set Port
app.set("port", 5001);

// macOS Monterey uses port 5000 for new AirPlay service by default.

app.listen(app.get("port"), () => {
  console.log("Server started on port " + app.get("port"));
});
