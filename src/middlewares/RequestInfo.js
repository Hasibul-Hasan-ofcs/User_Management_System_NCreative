const { logger } = require("../utilities/Logger");

const requestInfo = (req, _, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

module.exports = requestInfo;
