import { useState } from 'react';
import { Search, Filter, Download, Eye, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhitelistHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock data
  const whitelists = [
    {
      id: 1,
      firstname: 'Jean',
      lastname: 'Dupont',
      discord: 'jean#1234',
      category: 'Legal',
      status: 'validée',
      score: 85,
      admin: 'Admin1',
      date: '2025-12-01 14:30',
      duration: 25,
    },
    {
      id: 2,
      firstname: 'Marie',
      lastname: 'Martin',
      discord: 'marie#5678',
      category: 'Illégal',
      status: 'en_attente',
      score: 72,
      admin: 'Admin2',
      date: '2025-12-01 13:45',
      duration: 18,
    },
    {
      id: 3,
      firstname: 'Pierre',
      lastname: 'Durand',
      discord: 'pierre#9012',
      category: 'Legal',
      status: 'validée',
      score: 91,
      admin: 'Admin1',
      date: '2025-12-01 12:15',
      duration: 30,
    },
    {
      id: 4,
      firstname: 'Sophie',
      lastname: 'Bernard',
      discord: 'sophie#3456',
      category: 'Legal',
      status: 'refusée',
      score: 45,
      admin: 'Admin3',
      date: '2025-12-01 11:00',
      duration: 20,
    },
    {
      id: 5,
      firstname: 'Lucas',
      lastname: 'Petit',
      discord: 'lucas#7890',
      category: 'Illégal',
      status: 'validée',
      score: 78,
      admin: 'Admin2',
      date: '2025-12-01 10:20',
      duration: 22,
    },
    {
      id: 6,
      firstname: 'Emma',
      lastname: 'Robert',
      discord: 'emma#2468',
      category: 'Legal',
      status: 'validée',
      score: 88,
      admin: 'Admin1',
      date: '2025-11-30 16:45',
      duration: 28,
    },
    {
      id: 7,
      firstname: 'Thomas',
      lastname: 'Moreau',
      discord: 'thomas#1357',
      category: 'Illégal',
      status: 'refusée',
      score: 52,
      admin: 'Admin3',
      date: '2025-11-30 15:30',
      duration: 15,
    },
    {
      id: 8,
      firstname: 'Léa',
      lastname: 'Simon',
      discord: 'lea#9876',
      category: 'Legal',
      status: 'en_attente',
      score: 68,
      admin: 'Admin2',
      date: '2025-11-30 14:00',
      duration: 19,
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

  const getCategoryColor = (category: string) => {
    return category === 'Legal' ? 'text-green-400' : 'text-red-400';
  };

  const filteredWhitelists = whitelists.filter((wl) => {
    const matchesSearch =
      `${wl.firstname} ${wl.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wl.discord.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wl.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || wl.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: whitelists.length,
    validated: whitelists.filter((w) => w.status === 'validée').length,
    refused: whitelists.filter((w) => w.status === 'refusée').length,
    pending: whitelists.filter((w) => w.status === 'en_attente').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historique des Whitelists</h1>
          <p className="text-muted-foreground mt-2">
            Consultez et gérez toutes les whitelists passées
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/50">
          <Download className="w-5 h-5" />
          Exporter CSV
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Validées</p>
          <p className="text-2xl font-bold text-green-400">{stats.validated}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Refusées</p>
          <p className="text-2xl font-bold text-red-400">{stats.refused}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">En attente</p>
          <p className="text-2xl font-bold text-orange-400">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-foreground">Filtres</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom ou Discord..."
              className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
          >
            <option value="all">Tous les statuts</option>
            <option value="validée">Validées</option>
            <option value="refusée">Refusées</option>
            <option value="en_attente">En attente</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
          >
            <option value="all">Toutes les catégories</option>
            <option value="Legal">Legal</option>
            <option value="Illégal">Illégal</option>
          </select>
        </div>

        {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' ? (
          <div className="mt-4 flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {filteredWhitelists.length} résultat(s) trouvé(s)
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : null}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Candidat
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredWhitelists.map((wl) => (
                <tr key={wl.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {wl.firstname.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {wl.firstname} {wl.lastname}
                        </p>
                        <p className="text-xs text-muted-foreground">{wl.discord}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getCategoryColor(wl.category)}`}>
                      {wl.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            wl.score >= 70
                              ? 'bg-green-500'
                              : wl.score >= 50
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${wl.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">{wl.score}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        wl.status
                      )}`}
                    >
                      {getStatusLabel(wl.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{wl.admin}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">{wl.date.split(' ')[0]}</p>
                        <p className="text-xs text-muted-foreground">{wl.date.split(' ')[1]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/whitelist/${wl.id}`}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWhitelists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune whitelist trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhitelistHistory;
