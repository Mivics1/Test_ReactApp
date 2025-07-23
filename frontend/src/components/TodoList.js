import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList({ token }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/todos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTodos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch todos');
        setLoading(false);
      }
    };

    fetchTodos();
  }, [token]);

  const handleEdit = (todo) => {
  setEditingId(todo.id);
  setEditText(todo.title);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `/api/todos/${id}`,
        { title: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      // Either refresh or update local state
      const updatedTodos = todos.map(todo => 
        todo.id === id ? { ...todo, title: editText } : todo
      );
      setTodos(updatedTodos); // If you're using state for todos
    } catch (err) {
      console.error('Failed to update todo', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/todos/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Your Todos</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleUpdate(todo.id)}>Save</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.title}
                </span>
                <button onClick={() => handleEdit(todo)}>Edit</button>
              </>
            )}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id, todo.completed)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;