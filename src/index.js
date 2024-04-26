const express = require("express");
require("dotenv").config();
require("colors");
const port = process.env.PORT || 3050;
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Welcome to user management"));

app.listen(port, () =>
  console.log(`Server started, listening to port ${port}...`.cyan)
);
