import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import PrivateRoute from './components/PrivateRoute';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [taskListKey, setTaskListKey] = useState(0);

  const handleTaskAdded = () => {
    setTaskListKey(prev => prev + 1);
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <div className="App">
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/tasks"
                  element={
                    <PrivateRoute>
                      <div>
                        <TaskForm onTaskAdded={handleTaskAdded} />
                        <TaskList key={taskListKey} />
                      </div>
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/tasks" replace />} />
              </Routes>
            </Container>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;