import { AccessTime, Flag } from '@mui/icons-material';
import { Box, Chip } from '@mui/material';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    'todo': {
      title: 'To Do',
      items: []
    },
    'inProgress': {
      title: 'In Progress',
      items: []
    },
    'completed': {
      title: 'Completed',
      items: []
    }
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        headers: {
          'x-auth-token': token
        }
      });
      
      const tasks = await response.json();
      
      // Organize tasks into columns
      const newColumns = {
        'todo': { title: 'To Do', items: [] },
        'inProgress': { title: 'In Progress', items: [] },
        'completed': { title: 'Completed', items: [] }
      };
      
      tasks.forEach(task => {
        switch(task.status) {
          case 'completed':
            newColumns.completed.items.push(task);
            break;
          case 'in-progress':
            newColumns.inProgress.items.push(task);
            break;
          default:
            newColumns.todo.items.push(task);
        }
      });
      
      setColumns(newColumns);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // If dropped in the same column but different position
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const items = Array.from(column.items);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items
        }
      });
    } else {
      // If dropped in a different column
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [removed] = sourceItems.splice(source.index, 1);
      
      // Update task status in the backend
      const newStatus = destination.droppableId === 'completed' ? 'completed' : 
                       destination.droppableId === 'inProgress' ? 'in-progress' : 
                       'pending';
                       
      try {
        await fetch(`http://localhost:5001/api/tasks/${removed._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ status: newStatus })
        });
        
        removed.status = newStatus;
        destItems.splice(destination.index, 0, removed);

        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems
          }
        });
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 4 }}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Paper 
            key={columnId}
            sx={{ 
              width: '32%',
              minHeight: 500,
              padding: 2,
              backgroundColor: theme => 
                columnId === 'completed' ? theme.palette.success.light :
                columnId === 'inProgress' ? theme.palette.warning.light :
                theme.palette.grey[100]
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {column.title} ({column.items.length})
            </Typography>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ minHeight: '100%' }}
                >
                  {column.items.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                        <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ 
                            p: 2,
                            mb: 2,
                            backgroundColor: 'white',
                            borderLeft: 4,
                            borderColor: getPriorityColor(task.priority),
                            '&:hover': {
                                boxShadow: 3
                            }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {task.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                {task.dueDate && (
                                <Chip
                                    size="small"
                                    label={formatDueDate(task.dueDate)}
                                    color={getDueDateColor(task.dueDate)}
                                    icon={<AccessTime fontSize="small" />}
                                />
                                )}
                                <PriorityIcon priority={task.priority} />
                            </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                            {task.description}
                            </Typography>
                        </Paper>
                        )}
                    </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Paper>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default KanbanBoard;