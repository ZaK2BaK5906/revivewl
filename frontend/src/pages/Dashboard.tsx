import { FileText, CheckCircle, XCircle, Clock, TrendingUp, Users, Calendar } from 'lucide-react';

const Dashboard = () => {
  // Mock data - sera remplacé par des vraies données de l'API
  const stats = {
    total: 156,
    validated: 89,
    refused: 42,
    pending: 25,
    todayInterviews: 8,
    avgDuration: 25,
    successRate: 68,
  };

  const recentWhitelists = [
    { id: 1, name: 'Jean Dupont', status: 'validée', score: 85, time: 'Il y a 10 min', category: 'Legal' },
    { id: 2, name: 'Marie Martin', status: 'en_attente', score: 72, time: 'Il y a 25 min', category: 'Illégal' },
    { id: 3, name: 'Pierre Durand', status: 'validée', score: 91, time: 'Il y a 1h', category: 'Legal' },
    { id: 4, name: 'Sophie Bernard', status: 'refusée', score: 45, time: 'Il y a 2h', category: 'Legal' },
    { id: 5, name: 'Lucas Petit', status: 'validée', score: 78, time: 'Il y a 3h', category: 'Illégal' },
  ];

  const topAdmins = [
    { name: 'Admin1', count: 45, avatar: 'A' },
    { name: 'Admin2', count: 38, avatar: 'A' },
    { name: 'Admin3', count: 32, avatar: 'A' },
  ];

  const cards = [
    {
      title: 'Total WL',
      value: stats.total,
      icon: FileText,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      change: '+12%',
      changePositive: true,
    },
    {
      title: 'Validées',
      value: stats.validated,
      icon: CheckCircle,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-600/10',
      change: '+8%',
      changePositive: true,
    },
    {
      title: 'Refusées',
      value: stats.refused,
      icon: XCircle,
      color: 'red',
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-500/10 to-rose-600/10',
      change: '-3%',
      changePositive: true,
    },
    {
      title: 'En attente',
      value: stats.pending,
      icon: Clock,
      color: 'orange',
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-500/10 to-amber-600/10',
      change: '+5%',
      changePositive: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validée':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'refusée':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'en_attente':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'validée':
        return 'Validée';
      case 'refusée':
        return 'Refusée';
      case 'en_attente':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de vos whitelists</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="relative overflow-hidden bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-foreground">{card.value}</p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      card.changePositive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Aujourd'hui</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.todayInterviews}</p>
          <p className="text-xs text-muted-foreground mt-1">Entretiens réalisés</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Taux de réussite</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.successRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Durée moyenne</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.avgDuration} min</p>
          <p className="text-xs text-muted-foreground mt-1">Par entretien</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Whitelists */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Dernières Whitelists
          </h2>
          <div className="space-y-3">
            {recentWhitelists.map((wl) => (
              <div
                key={wl.id}
                className="flex items-center justify-between p-4 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {wl.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{wl.name}</p>
                    <p className="text-xs text-muted-foreground">{wl.category} • {wl.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{wl.score}/100</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(
                      wl.status
                    )}`}
                  >
                    {getStatusLabel(wl.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Admins */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Top Admins
          </h2>
          <div className="space-y-4">
            {topAdmins.map((admin, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  {admin.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{admin.name}</p>
                  <p className="text-xs text-muted-foreground">{admin.count} WL traitées</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
