const mongoose = require("mongoose");
const { logger } = require("../src/utilities/Logger");
require("color");
require("dotenv").config();

const DBuri = process.env.DBURI.replace(
  "<DBUSERNAME>:<DBPASSWORD>",
  `${process.env.DBUSERNAME}:${process.env.DBPASSWORD}`
);

const connectDB = async () => {
  try {
    const connectionStat = await mongoose.connect(DBuri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(
      `Database connection successful on ${connectionStat.connection.host}`.blue
        .bold
    );
  } catch (error) {
    logger.error(`Database connection failed. ${error}`);
  }
};

module.exports = connectDB;
