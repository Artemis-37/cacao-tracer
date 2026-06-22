import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import OperationsPage from './pages/OperationsPage';
import DatabasePage from './pages/DatabasePage';

// Redux
import { selectIsAuthenticated } from './redux/slices/authSlice';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="operations" element={<OperationsPage />} />
          <Route path="database" element={<DatabasePage />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
