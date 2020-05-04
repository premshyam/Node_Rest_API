// global error handler middleware
const HttpStatus = require("http-status-codes");
const errorHandler = (error, req, res, next) => {
  console.log(error);
  console.log({ message: error.message, statusCode: error.statusCode });

  return res
    .status(error.statusCode)
    .json({ message: error.message, errors: [] });
};

module.exports = errorHandler;
