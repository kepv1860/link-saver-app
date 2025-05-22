import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar'; // Import Navbar
// import LinkListPage from './pages/LinkListPage'; // Assuming you might have a dedicated page for all links

// Basic check for authentication (replace with a more robust solution like Context API or Redux)
const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar /> {/* Add Navbar here */}
        <main className="pt-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/links" element={<ProtectedRoute><LinkListPage /></ProtectedRoute>} /> */}
            
            {/* Fallback for non-matched routes - could be a 404 page */}
            <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

