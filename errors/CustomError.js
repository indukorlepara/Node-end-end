class CustomError extends Error {
    constructor(message, statusCode = 500, details = {}) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  module.exports = CustomError;