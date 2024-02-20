const { statusCodeError } = require("./statusCodeConstants");

const statusCodeHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case statusCodeError.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed.",
        error: err.message,
      });
      break;
    case statusCodeError.UNAUTHORIZED:
      res.json({
        title: "Unauthorized.",
        error: err.message,
      });
      break;
    case statusCodeError.FORBIDDEN:
      res.json({
        title: "Forbidden.",
        error: err.message,
      });
      break;
    case statusCodeError.NOT_FOUND:
      res.json({
        title: "Not Found.",
        error: err.message,
      });
      break;
    case statusCodeError.SERVER_ERROR:
      res.json({
        title: "Server Error.",
        error: err.message,
      });
      break;
    default:
      console.error(`Unhandled status code: ${statusCode}\n${err.message}`);
      break;
  }
};

module.exports = statusCodeHandler;
