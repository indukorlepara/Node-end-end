const request = require('supertest');
const app = require('../app'); // or wherever your Express app is exported

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'test123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'test123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
