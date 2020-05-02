// global error handler middleware
const errorHandler = (error, req, res, next) => {
  console.log({ message: error.message, errors: error.data });
  res
    .status(error.statusCode)
    .json({ message: error.message, errors: error.data });
};

module.exports = errorHandler;
