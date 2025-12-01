import { useState } from 'react';
import {
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Award,
  BarChart3,
} from 'lucide-react';

const Statistics = () => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');

  // Mock data for statistics
  const stats = {
    today: {
      total: 5,
      validated: 3,
      refused: 1,
      pending: 1,
      avgScore: 78,
      avgDuration: 23,
    },
    week: {
      total: 32,
      validated: 21,
      refused: 7,
      pending: 4,
      avgScore: 75,
      avgDuration: 25,
    },
    month: {
      total: 128,
      validated: 85,
      refused: 28,
      pending: 15,
      avgScore: 76,
      avgDuration: 24,
    },
    year: {
      total: 1456,
      validated: 982,
      refused: 321,
      pending: 153,
      avgScore: 74,
      avgDuration: 26,
    },
  };

  const currentStats = stats[period];
  const successRate = ((currentStats.validated / currentStats.total) * 100).toFixed(1);

  // Mock data for trends
  const weeklyTrends = [
    { day: 'Lun', whitelists: 4, validated: 3, refused: 1 },
    { day: 'Mar', whitelists: 6, validated: 4, refused: 2 },
    { day: 'Mer', whitelists: 5, validated: 3, refused: 1 },
    { day: 'Jeu', whitelists: 3, validated: 2, refused: 1 },
    { day: 'Ven', whitelists: 7, validated: 5, refused: 1 },
    { day: 'Sam', whitelists: 4, validated: 3, refused: 1 },
    { day: 'Dim', whitelists: 3, validated: 1, refused: 0 },
  ];

  const categoryStats = [
    { category: 'Legal', count: 68, percentage: 65, color: 'bg-green-500' },
    { category: 'Illégal', count: 36, percentage: 35, color: 'bg-red-500' },
  ];

  const topAdmins = [
    { name: 'Admin1', whitelists: 45, avgScore: 82, successRate: 88 },
    { name: 'Admin2', whitelists: 38, avgScore: 78, successRate: 85 },
    { name: 'Admin3', whitelists: 31, avgScore: 75, successRate: 81 },
    { name: 'Admin4', whitelists: 14, avgScore: 71, successRate: 79 },
  ];

  const scoreDistribution = [
    { range: '0-20', count: 5, percentage: 4 },
    { range: '21-40', count: 8, percentage: 6 },
    { range: '41-60', count: 18, percentage: 14 },
    { range: '61-80', count: 52, percentage: 41 },
    { range: '81-100', count: 45, percentage: 35 },
  ];

  const maxScore = Math.max(...scoreDistribution.map((s) => s.count));

  const maxWhitelists = Math.max(...weeklyTrends.map((t) => t.whitelists));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistiques</h1>
          <p className="text-muted-foreground mt-2">
            Analyse détaillée des performances et tendances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPeriod('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === 'today'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === 'week'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === 'month'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === 'year'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Année
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {period === 'today' ? "Aujourd'hui" : period === 'week' ? 'Cette semaine' : period === 'month' ? 'Ce mois' : 'Cette année'}
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{currentStats.total}</p>
          <p className="text-sm text-muted-foreground">Total Whitelists</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs text-green-400 font-semibold">{successRate}%</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{currentStats.validated}</p>
          <p className="text-sm text-muted-foreground">Validées</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-xs text-red-400 font-semibold">
              {((currentStats.refused / currentStats.total) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{currentStats.refused}</p>
          <p className="text-sm text-muted-foreground">Refusées</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-xs text-orange-400 font-semibold">
              {((currentStats.pending / currentStats.total) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{currentStats.pending}</p>
          <p className="text-sm text-muted-foreground">En attente</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Score Moyen</p>
              <p className="text-2xl font-bold text-foreground">{currentStats.avgScore}/100</p>
            </div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
              style={{ width: `${currentStats.avgScore}%` }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Durée Moyenne</p>
              <p className="text-2xl font-bold text-foreground">{currentStats.avgDuration} min</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Temps moyen d'entretien par candidat
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-foreground">Tendances Hebdomadaires</h2>
          </div>
          <div className="space-y-4">
            {weeklyTrends.map((trend) => (
              <div key={trend.day}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{trend.day}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-green-400">✓ {trend.validated}</span>
                    <span className="text-xs text-red-400">✗ {trend.refused}</span>
                    <span className="text-xs text-muted-foreground">
                      Total: {trend.whitelists}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${(trend.whitelists / maxWhitelists) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-foreground">Répartition par Catégorie</h2>
          </div>
          <div className="space-y-6">
            {categoryStats.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{cat.count} WL</span>
                    <span className="text-sm font-bold text-foreground">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} transition-all`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">
                {categoryStats.reduce((acc, cat) => acc + cat.count, 0)} WL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Admins */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-foreground">Top Administrateurs</h2>
          </div>
          <div className="space-y-4">
            {topAdmins.map((admin, index) => (
              <div
                key={admin.name}
                className="flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                      : index === 2
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{admin.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {admin.whitelists} whitelists • Taux: {admin.successRate}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{admin.avgScore}</p>
                  <p className="text-xs text-muted-foreground">Score moy.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-foreground">Distribution des Scores</h2>
          </div>
          <div className="space-y-4">
            {scoreDistribution.map((score) => (
              <div key={score.range}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{score.range} pts</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{score.count} candidats</span>
                    <span className="text-sm font-bold text-foreground">{score.percentage}%</span>
                  </div>
                </div>
                <div className="relative h-8 bg-secondary rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${(score.count / maxScore) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <span className="text-xs font-semibold text-foreground">{score.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
