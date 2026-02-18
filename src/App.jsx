import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WorkOrder from './pages/WorkOrder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mission/new" element={<WorkOrder />} />
        <Route path="/mission/:id" element={<WorkOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

