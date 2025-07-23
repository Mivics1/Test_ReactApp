import React, { useState } from 'react';
import axios from 'axios';

function TodoForm({ token }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/todos',
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setError('');
      // In a real app, we would update the todo list here
      window.location.reload(); // Simple refresh for demo
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  return (
    <div>
      <h2>Add New Todo</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default TodoForm;