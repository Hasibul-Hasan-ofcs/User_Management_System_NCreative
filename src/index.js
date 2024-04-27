const express = require("express");
const { logger } = require("./utilities/Logger");
const requestInfo = require("./middlewares/RequestInfo");
const userRouter = require("./routes/UserRouter");
const notFound = require("./middlewares/NotFoundHandler");
const errorHandler = require("./middlewares/ErrorHandler");
const bodyParser = require("body-parser");
const connectDB = require("../configurations/DBConnect");
require("dotenv").config();
require("colors");
const port = process.env.PORT || 3050;
const app = express();
const multer = require("multer");
const Storage = require("../configurations/Multer");
const { default: rateLimit } = require("express-rate-limit");
const upload = multer({ storage: Storage });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100, // Limits to 100 requests per 15 minutes.
});

app.use(limiter);

app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(requestInfo);

app.use("/api/user", upload.single("image"), userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to user management");
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  logger.info(`Server started, listening to port ${port}...`.cyan)
);

module.exports = { app };
