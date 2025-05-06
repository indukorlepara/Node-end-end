const CustomError = require('./CustomError');
class ValidationError extends CustomError {
  constructor(message = 'Validation failed', details = {}) {
    super(message, 400, details);
  }
}
module.exports = ValidationError;