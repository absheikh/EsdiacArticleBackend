﻿require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("_middleware/error-handler");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.route("/api").get((req, res) => {
  res.json({ message: "Welcome to the Esdiac Article API" });
});
app.use("/api/users", require("./users/users.controller"));
app.use("/api/articles", require("./articles/article.controller"));

// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === "development" ? process.env.PORT || 5000 : 3000;
app.listen(port, () => console.log("Server listening on port " + port));
