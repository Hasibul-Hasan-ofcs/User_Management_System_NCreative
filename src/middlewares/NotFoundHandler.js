const notFound = (req, res, next) => {
  const err = new Error(`Noting found for request ${req.originalUrl}`);
  res.status(404);
  next(err);
};

module.exports = notFound;
