import React, { useState, useEffect } from 'react';
import { Users, CreditCard, TrendingUp, FileText, Eye, DollarSign, UserCheck, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Analytics } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  // Mock data for demonstration
  const mockData = {
    visitors: 2547,
    pageViews: 8932,
    subscriptions: 342,
    revenue: 15678.50,
    conversionRate: 3.8,
    period: 'month' as const
  };

  const visitorData = [
    { name: 'Lun', visitors: 420, pageViews: 1200 },
    { name: 'Mar', visitors: 380, pageViews: 1100 },
    { name: 'Mer', visitors: 520, pageViews: 1400 },
    { name: 'Jeu', visitors: 440, pageViews: 1250 },
    { name: 'Ven', visitors: 590, pageViews: 1600 },
    { name: 'Sam', visitors: 320, pageViews: 900 },
    { name: 'Dim', visitors: 280, pageViews: 800 }
  ];

  const subscriptionData = [
    { name: 'Basic', value: 45, color: '#8884d8' },
    { name: 'Premium', value: 35, color: '#82ca9d' },
    { name: 'Pro', value: 20, color: '#ffc658' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Fév', revenue: 13500 },
    { month: 'Mar', revenue: 14200 },
    { month: 'Avr', revenue: 15100 },
    { month: 'Mai', revenue: 16800 },
    { month: 'Jun', revenue: 15678 }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics(mockData);
      setLoading(false);
      
      // Notification de bienvenue pour les admins
      addNotification({
        type: 'success',
        title: 'Tableau de bord chargé',
        message: 'Toutes les données ont été mises à jour avec succès.',
        category: 'system',
        priority: 'low'
      });
    }, 1000);
  }, [addNotification]);

  const stats = [
    {
      title: 'Visiteurs totaux',
      value: analytics?.visitors || 0,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Vues de page',
      value: analytics?.pageViews || 0,
      icon: <Eye className="h-6 w-6" />,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Abonnements actifs',
      value: analytics?.subscriptions || 0,
      icon: <UserCheck className="h-6 w-6" />,
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'Revenus mensuels',
      value: `€${analytics?.revenue || 0}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-orange-500',
      change: '+15%'
    }
  ];

  const alerts = [
    {
      type: 'info',
      message: '5 nouveaux abonnements aujourd\'hui',
      time: 'Il y a 2 heures'
    },
    {
      type: 'warning',
      message: 'Taux de conversion en baisse de 2%',
      time: 'Il y a 4 heures'
    },
    {
      type: 'success',
      message: 'Objectif mensuel de revenus atteint',
      time: 'Il y a 6 heures'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre plateforme MonFritkot</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg text-white mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visiteurs et vues de page</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="pageViews" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des abonnements</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {subscriptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des revenus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value}`, 'Revenus']} />
              <Bar dataKey="revenue" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes récentes</h3>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-1 rounded-full ${
                alert.type === 'success' ? 'bg-green-100' :
                alert.type === 'warning' ? 'bg-yellow-100' :
                'bg-blue-100'
              }`}>
                <AlertCircle className={`h-4 w-4 ${
                  alert.type === 'success' ? 'text-green-600' :
                  alert.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;