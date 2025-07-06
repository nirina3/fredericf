import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, TrendingUp, TrendingDown, Calendar, Download, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const AnalyticsManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  // Mock data pour les analytics
  const visitorData = [
    { date: '2024-02-14', visitors: 420, pageViews: 1200, newUsers: 85 },
    { date: '2024-02-15', visitors: 380, pageViews: 1100, newUsers: 72 },
    { date: '2024-02-16', visitors: 520, pageViews: 1400, newUsers: 98 },
    { date: '2024-02-17', visitors: 440, pageViews: 1250, newUsers: 89 },
    { date: '2024-02-18', visitors: 590, pageViews: 1600, newUsers: 112 },
    { date: '2024-02-19', visitors: 320, pageViews: 900, newUsers: 65 },
    { date: '2024-02-20', visitors: 280, pageViews: 800, newUsers: 58 }
  ];

  const subscriptionData = [
    { name: 'Basic', value: 45, color: '#10B981' },
    { name: 'Premium', value: 35, color: '#3B82F6' },
    { name: 'Pro', value: 20, color: '#8B5CF6' }
  ];

  const topPages = [
    { page: '/gallery', views: 3420, bounce: 32 },
    { page: '/pricing', views: 2890, bounce: 28 },
    { page: '/blog', views: 2156, bounce: 45 },
    { page: '/directory', views: 1890, bounce: 38 },
    { page: '/about', views: 1234, bounce: 52 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12000, subscriptions: 45 },
    { month: 'Fév', revenue: 13500, subscriptions: 52 },
    { month: 'Mar', revenue: 14200, subscriptions: 58 },
    { month: 'Avr', revenue: 15100, subscriptions: 61 },
    { month: 'Mai', revenue: 16800, subscriptions: 68 },
    { month: 'Jun', revenue: 15678, subscriptions: 65 }
  ];

  const deviceData = [
    { device: 'Desktop', sessions: 1250, percentage: 52 },
    { device: 'Mobile', sessions: 890, percentage: 37 },
    { device: 'Tablet', sessions: 260, percentage: 11 }
  ];

  const stats = [
    {
      title: 'Visiteurs totaux',
      value: '2,547',
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Pages vues',
      value: '8,932',
      change: '+8.2%',
      trend: 'up',
      icon: <Eye className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Taux de conversion',
      value: '3.8%',
      change: '-2.1%',
      trend: 'down',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Revenus mensuels',
      value: '€15,678',
      change: '+15.3%',
      trend: 'up',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const canViewAnalytics = () => {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
  };

  if (!canViewAnalytics()) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs et éditeurs peuvent voir les analytics.</p>
      </div>
    );
  }

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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Statistiques</h1>
            <p className="text-gray-600 mt-2">Vue d'ensemble des performances de la plateforme</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">1 an</option>
            </select>
            <Button
              variant="outline"
              icon={<Download className="h-4 w-4" />}
            >
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
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
                <span className={`text-sm font-medium flex items-center ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visiteurs et vues de page</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')} />
              <Area type="monotone" dataKey="visitors" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="pageViews" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
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
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des revenus et abonnements</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="revenue" fill="#F59E0B" />
              <Line yAxisId="right" type="monotone" dataKey="subscriptions" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pages les plus visitées</h3>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{page.page}</div>
                  <div className="text-sm text-gray-600">{page.views} vues</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{page.bounce}%</div>
                  <div className="text-xs text-gray-500">Taux de rebond</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par appareil</h3>
          <div className="space-y-4">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <span className="font-medium text-gray-900">{device.device}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{device.sessions} sessions</span>
                  <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Activité en temps réel</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">En direct</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">23</div>
            <div className="text-sm text-gray-600">Utilisateurs actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
            <div className="text-sm text-gray-600">Pages vues (1h)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
            <div className="text-sm text-gray-600">Nouveaux utilisateurs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">2</div>
            <div className="text-sm text-gray-600">Conversions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManagement;