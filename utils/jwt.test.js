const { generateToken, verifyToken } = require('./jwt');
const jwt = require('jsonwebtoken');

describe('JWT Utils', () => {
  let token;
  const user = { _id: '1', name: 'John', email: 'john@example.com' };

  it('should generate a token', () => {
    token = generateToken(user);
    expect(token).toBeTruthy();
  });

  it('should verify a token', () => {
    const decoded = verifyToken(token);
    expect(decoded).toHaveProperty('id');
    expect(decoded.id).toBe(user._id);
  });

  it('should throw error for invalid token', () => {
    expect(() => verifyToken('invalid-token')).toThrow('Invalid or expired token');
  });
});
