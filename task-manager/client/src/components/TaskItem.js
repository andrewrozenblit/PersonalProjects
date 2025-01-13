import React, { useState } from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const TaskItem = ({ task, onTaskUpdate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const { token } = useAuth();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async () => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask({ status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditedTask(task);
  };

  const handleEditSave = async () => {
    try {
      await updateTask(editedTask);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      onTaskUpdate();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    handleMenuClose();
  };

  const updateTask = async (updates) => {
    try {
        const response = await fetch(`http://localhost:5001/api/tasks/${task._id}`, {  // Changed from 5000
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      onTaskUpdate();
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton edge="end" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        }
      >
        <Checkbox
          checked={task.status === 'completed'}
          onChange={handleStatusChange}
        />
        <ListItemText
          primary={task.title}
          secondary={task.description}
          sx={{
            textDecoration: task.status === 'completed' ? 'line-through' : 'none'
          }}
        />
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskItem;