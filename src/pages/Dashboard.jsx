import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionBar from '../components/dashboard/ActionBar';
import MissionCard from '../components/dashboard/MissionCard';
import StatCard from '../components/dashboard/StatCard';
import { SimpleDonutChart, SimpleBarChart, SimpleHorizontalBarChart } from '../components/dashboard/Charts';
import { missions } from '../data/mockData';
import Card from '../components/ui/Card';
import {
  Briefcase, Clock, CalendarDays, CheckCircle2,
  TrendingUp, TrendingDown, Users
} from 'lucide-react';

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

  // --- KPI Calculation ---
  const totalMissions = missions.length;
  const overdueMissions = missions.filter(m => m.status === 'En Retard').length;
  // Mock "This Week" - let's assume 3 for demo
  const thisWeekMissions = 3;
  const completedMissions = missions.filter(m => m.status === 'Terminée').length;
  const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

  // --- Chart Data Preparation ---
  // 1. Status Distribution
  const statusCounts = missions.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = [
    { label: 'Planifiée', value: statusCounts['Planifiée'] || 0, color: '#3b82f6' }, // blue-500
    { label: 'En Cours', value: statusCounts['En Cours'] || 0, color: '#10b981' },   // emerald-500
    { label: 'En Retard', value: statusCounts['En Retard'] || 0, color: '#ef4444' }, // red-500
    { label: 'Terminée', value: statusCounts['Terminée'] || 0, color: '#6366f1' },  // indigo-500
  ].filter(d => d.value > 0);

  // 2. Monthly Missions (Mock Data for demo as dates are sparse)
  const monthlyData = [
    { label: 'Jan', value: 12 },
    { label: 'Fév', value: 18 },
    { label: 'Mar', value: 9 },
    { label: 'Avr', value: 22 },
    { label: 'Mai', value: 15 },
    { label: 'Juin', value: 28 },
  ];

  // 3. Technician Performance
  const techCounts = missions.reduce((acc, curr) => {
    acc[curr.chef] = (acc[curr.chef] || 0) + 1;
    return acc;
  }, {});

  const techChartData = Object.entries(techCounts).map(([name, count]) => ({
    label: name,
    value: count,
    color: '#8b5cf6' // violet-500
  })).sort((a, b) => b.value - a.value).slice(0, 5);


  return (
    <>
      <ActionBar onNewMission={handleNewMission} />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 1. KPIs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Missions"
            value={totalMissions}
            icon={Briefcase}
            color="bg-blue-500"
            subtext="Toutes catégories"
            trend="up"
            trendValue="12%"
          />
          <StatCard
            title="En Retard"
            value={overdueMissions}
            icon={Clock}
            color="bg-red-500"
            subtext="Attention requise"
            trend="down"
            trendValue="2"
          />
          <StatCard
            title="Cette Semaine"
            value={thisWeekMissions}
            icon={CalendarDays}
            color="bg-amber-500"
            subtext="Agenda chargé"
            trend="up"
            trendValue="5"
          />
          <StatCard
            title="Taux Complétion"
            value={`${completionRate}%`}
            icon={CheckCircle2}
            color="bg-emerald-500"
            subtext="Objectif: 85%"
            trend="up"
            trendValue="3%"
          />
        </div>

        {/* 2. Intelligent Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-80">
          <Card className="p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-500" />
              Répartition par Statut
            </h3>
            <div className="flex-1 min-h-[200px]">
              <SimpleDonutChart data={statusChartData} />
            </div>
          </Card>

          <Card className="p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              Missions par Mois (2026)
            </h3>
            <div className="flex-1 min-h-[200px]">
              <SimpleBarChart data={monthlyData} height={200} />
            </div>
          </Card>

          <Card className="p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              Top Techniciens
            </h3>
            <div className="flex-1 overflow-y-auto">
              <SimpleHorizontalBarChart data={techChartData} />
            </div>
          </Card>
        </div>

        {/* 3. Detailed Mission List (Unique Section) */}
        <div className="pb-10">
          <MissionCard
            title="Mes Missions"
            data={missions}
            isLoading={loading}
            onRowClick={handleRowClick}
            total={totalMissions}
          />
        </div>

      </main>
    </>
  );
}
