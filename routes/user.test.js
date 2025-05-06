jest.setTimeout(10000);
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt'); 

let token;

beforeAll(async () => {
  // Create a test user with a password
  const user = new User({
    name: 'FINALLLLLTEST',
    email: 'FINALLLLLTEST2@example.com',
    password: 'FINALLLLLTEST', // Ensure password is provided
  });

  await user.save();

  token = generateToken(user);  // Ensure this token generation is correct
});

afterAll(async () => {
  await User.deleteMany();
});

describe('User routes', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'FINALLLLLTEST',
        email: 'FINALLLLLTEST9@example.com',
        password: 'FINALLLLLTEST', // Make sure password is also passed here
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('email', 'FINALLLLLTEST9@example.com');
expect(response.body).toHaveProperty('name', 'FINALLLLLTEST');
  });
});
