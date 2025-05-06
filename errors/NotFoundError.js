// errors/NotFoundError.js
const CustomError = require('./CustomError');
class NotFoundError extends CustomError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}
module.exports = NotFoundError;
