const request = require('supertest');
const app = require('./setup');
const { users } = require('../../backend/src/db');
const { expect } = require('chai'); // Add this line

describe('Authentication API', () => {
  describe('POST /api/login', () => {
    it('should return a token with valid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpass' });
      
      expect(res.statusCode).to.equal(200); // Changed to.equal
      expect(res.body).to.have.property('token'); // Changed to.have.property
    });

    it('should return 401 with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'testuser', password: 'wrongpass' });
      
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid credentials');
    });

    it('should return 401 with non-existent user', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'nonexistent', password: 'testpass' });
      
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid credentials');
    });
  });
});