import React, { useState, useEffect } from 'react';
import { 
  List, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
        const response = await fetch('http://localhost:5001/api/tasks', {  // Changed from 5000
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        My Tasks
      </Typography>
      <List>
        {tasks.map(task => (
          <TaskItem 
            key={task._id} 
            task={task} 
            onTaskUpdate={fetchTasks}
          />
        ))}
      </List>
    </Paper>
  );
};

export default TaskList;