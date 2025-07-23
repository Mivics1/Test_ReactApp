// Mock database
let users = [
  { id: 1, username: 'testuser', password: '$2b$10$A0JgK8XljgmbDUwawjhpwOStrIBmJVdFn8nWpbgF0Xa4zcAWKzblC' } // password: testpass
];

let todos = [
  { id: 1, userId: 1, title: 'Learn testing', completed: false }
];

module.exports = { users, todos };