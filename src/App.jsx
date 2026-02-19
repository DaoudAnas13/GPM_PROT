import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/dashboard/Navbar';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import Clients from './pages/Clients';
import Projets from './pages/Projets';
import Ressources from './pages/Ressources';
import Facturation from './pages/Facturation';
import WorkOrder from './pages/WorkOrder';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="/facturation" element={<Facturation />} />
          <Route path="/mission/new" element={<WorkOrder />} />
          <Route path="/mission/:id" element={<WorkOrder />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
