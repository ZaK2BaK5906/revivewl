import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { FileText, CheckCircle, XCircle, Clock, Users } from 'lucide-react';

const Dashboard = () => {
  const { token } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/stats/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const cards = [
    {
      title: 'Total WL',
      value: stats?.total || 0,
      icon: FileText,
      color: 'blue',
    },
    {
      title: 'Validées',
      value: stats?.validated || 0,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Refusées',
      value: stats?.refused || 0,
      icon: XCircle,
      color: 'red',
    },
    {
      title: 'En attente',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble des whitelists</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full bg-${card.color}-100 flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Whitelists */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dernières WL</h2>
        <div className="text-gray-500 text-center py-8">
          Chargement des données...
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
