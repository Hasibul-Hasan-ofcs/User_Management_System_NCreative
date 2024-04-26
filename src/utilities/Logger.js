require("dotenv").config();
const { createLogger, format, transports } = require("winston");
const isProduction = process.env.NODE_ENV == "production";

const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => {
      const { timestamp, level, message } = info;
      return `[${level}] ${timestamp} ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

module.exports = { logger };
