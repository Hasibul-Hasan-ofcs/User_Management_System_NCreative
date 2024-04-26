const express = require("express");
const { logger } = require("./utilities/Logger");
const requestInfo = require("./middlewares/RequestInfo");
const userRouter = require("./routes/UserRouter");
const notFound = require("./middlewares/NotFoundHandler");
const errorHandler = require("./middlewares/ErrorHandler");
require("dotenv").config();
require("colors");
const port = process.env.PORT || 3050;
const app = express();

app.use(express.json("1024kb"));
app.use(requestInfo);

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to user management");
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  logger.info(`Server started, listening to port ${port}...`.cyan)
);
