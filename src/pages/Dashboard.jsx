import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import ActionBar from '../components/dashboard/ActionBar';
import MissionCard from '../components/dashboard/MissionCard';
import { missions } from '../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRowClick = (mission) => {
    navigate(`/mission/${mission.id}`);
  };

  const handleNewMission = () => {
    navigate('/mission/new');
  };

  // Filter data for different cards
  const activeMissions = missions.filter(m => m.status === 'En Cours');
  const recentMissions = [...missions].sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut)).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <ActionBar onNewMission={handleNewMission} />

      <main className="max-w-[1440px] mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MissionCard
            title="Missions en Cours"
            data={activeMissions}
            type="list"
            isLoading={loading}
            onRowClick={handleRowClick}
          />

          <MissionCard
            title="Missions par Chef"
            data={missions}
            type="grouped"
            isLoading={loading}
          />

          <MissionCard
            title="Missions Récentes"
            data={recentMissions}
            type="list"
            isLoading={loading}
            onRowClick={handleRowClick}
          />

          <MissionCard
            title="Missions par Statut"
            data={missions}
            type="status"
            isLoading={loading}
          />
        </div>
      </main>
    </div>
  );
}

