const request = require('supertest');
const app = require('./setup');
const { users, todos } = require('../../backend/src/db');
const jwt = require('jsonwebtoken');
const { expect } = require('chai'); // Add this line

describe('Todo API', () => {
  let token;

  before(() => {
    token = jwt.sign({ userId: users[0].id }, 'your-secret-key', { expiresIn: '1h' });
  });

  describe('GET /api/todos', () => {
    it('should return todos for authenticated user', async () => {
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .get('/api/todos');
      
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property('message', 'No token provided');
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid token');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const newTodo = { title: 'Test todo' };
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send(newTodo);
      
      expect(res.statusCode).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.title).to.equal(newTodo.title);
      expect(res.body.completed).to.be.false;
    });

    it('should return 400 without title', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property('message', 'Title is required');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const todoToUpdate = todos[0];
      const updates = { title: 'Updated title', completed: true };
      
      const res = await request(app)
        .put(`/api/todos/${todoToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);
      
      expect(res.statusCode).to.equal(200);
      expect(res.body.title).to.equal(updates.title);
      expect(res.body.completed).to.equal(updates.completed);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app)
        .put('/api/todos/999')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Update' });
      
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property('message', 'Todo not found');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const todoToDelete = todos[todos.length - 1];
      const res = await request(app)
        .delete(`/api/todos/${todoToDelete.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).to.equal(204);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app)
        .delete('/api/todos/999')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property('message', 'Todo not found');
    });
  });
});