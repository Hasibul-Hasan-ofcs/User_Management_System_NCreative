const user = (req, res) => {
  res.status(200).send({
    message: "Hi welcome to user route!",
  });
};

module.exports = { user };
