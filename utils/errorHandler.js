const { error } = require("./errorConstants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case error.VALIDATION_ERROR:
      res.status(error.VALIDATION_ERROR).json({
        title: "Validation Failed.",
        error: err.message,
      });
      break;
    case error.UNAUTHORIZED:
      res.status(error.UNAUTHORIZED).json({
        title: "Unauthorized.",
        error: err.message,
      });
      break;
    case error.FORBIDDEN:
      res.status(error.FORBIDDEN).json({
        title: "Forbidden.",
        error: err.message,
      });
      break;
    case error.NOT_FOUND:
      res.status(error.NOT_FOUND).json({
        title: "Not Found.",
        error: err.message,
      });
      break;
    case error.SERVER_ERROR:
      res.status(error.SERVER_ERROR).json({
        title: "Server Error.",
        error: err.message,
      });
      break;
    default:
      console.error(`Unhandled status code: ${statusCode}`);
      break;
  }
};

module.exports = errorHandler;
