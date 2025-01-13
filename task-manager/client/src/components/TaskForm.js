import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const TaskForm = ({ onTaskAdded = () => {} }) => {  // Added default empty function
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5001/api/tasks', {  // Changed from 5000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      setFormData({ title: '', description: '', dueDate: '' });
      onTaskAdded();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Task Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          type="date"
          label="Due Date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained">
            Add Task
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TaskForm;