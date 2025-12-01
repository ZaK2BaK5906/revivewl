import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
} from 'lucide-react';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'ouvert' | 'en_cours' | 'fermé';
  priority: 'basse' | 'normale' | 'haute' | 'urgente';
  category: 'technique' | 'whitelist' | 'autre';
  author: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: number;
}

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      title: 'Problème de connexion base de données',
      description: 'Impossible de se connecter à la BDD depuis ce matin',
      status: 'ouvert',
      priority: 'urgente',
      category: 'technique',
      author: 'Admin2',
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 1800000),
      messages: 3,
    },
    {
      id: 2,
      title: 'Question sur procédure whitelist',
      description: 'Comment gérer un candidat qui a déjà été refusé?',
      status: 'en_cours',
      priority: 'normale',
      category: 'whitelist',
      author: 'Admin3',
      assignedTo: 'Admin1',
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 900000),
      messages: 5,
    },
    {
      id: 3,
      title: 'Mise à jour des templates',
      description: 'Besoin de mettre à jour les questions pour la catégorie Illégal',
      status: 'fermé',
      priority: 'basse',
      category: 'autre',
      author: 'Admin1',
      assignedTo: 'Admin1',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000),
      messages: 8,
    },
    {
      id: 4,
      title: 'Erreur lors de la validation',
      description: 'Bug lors de la validation finale d\'une whitelist',
      status: 'en_cours',
      priority: 'haute',
      category: 'technique',
      author: 'Admin4',
      assignedTo: 'Vous',
      createdAt: new Date(Date.now() - 10800000),
      updatedAt: new Date(Date.now() - 600000),
      messages: 2,
    },
  ]);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'normale',
    category: 'technique',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ouvert':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'en_cours':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      case 'fermé':
        return 'bg-green-500/20 text-green-400 border-green-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ouvert':
        return <AlertCircle className="w-4 h-4" />;
      case 'en_cours':
        return <Clock className="w-4 h-4" />;
      case 'fermé':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return 'bg-red-500/20 text-red-400';
      case 'haute':
        return 'bg-orange-500/20 text-orange-400';
      case 'normale':
        return 'bg-blue-500/20 text-blue-400';
      case 'basse':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 30) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tickets.length,
    ouvert: tickets.filter((t) => t.status === 'ouvert').length,
    en_cours: tickets.filter((t) => t.status === 'en_cours').length,
    fermé: tickets.filter((t) => t.status === 'fermé').length,
  };

  const handleCreateTicket = () => {
    if (newTicket.title.trim() && newTicket.description.trim()) {
      const ticket: Ticket = {
        id: tickets.length + 1,
        title: newTicket.title,
        description: newTicket.description,
        status: 'ouvert',
        priority: newTicket.priority as any,
        category: newTicket.category as any,
        author: 'Vous',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: 0,
      };
      setTickets([ticket, ...tickets]);
      setNewTicket({ title: '', description: '', priority: 'normale', category: 'technique' });
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tickets Support</h1>
          <p className="text-muted-foreground mt-2">
            Gérer les demandes et problèmes techniques
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau Ticket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Ouverts</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.ouvert}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm text-muted-foreground">En cours</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.en_cours}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Fermés</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.fermé}</p>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isCreating && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Créer un Ticket</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Titre *</label>
              <input
                type="text"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Problème technique..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                placeholder="Décrivez le problème en détail..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Priorité</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="basse">Basse</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="technique">Technique</option>
                  <option value="whitelist">Whitelist</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Créer le Ticket
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewTicket({
                    title: '',
                    description: '',
                    priority: 'normale',
                    category: 'technique',
                  });
                }}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un ticket..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="ouvert">Ouvert</option>
            <option value="en_cours">En cours</option>
            <option value="fermé">Fermé</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Toutes les priorités</option>
            <option value="urgente">Urgente</option>
            <option value="haute">Haute</option>
            <option value="normale">Normale</option>
            <option value="basse">Basse</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{ticket.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{ticket.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Par: {ticket.author}</span>
                  </div>
                  {ticket.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>Assigné à: {ticket.assignedTo}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Créé {formatTime(ticket.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{ticket.messages} message{ticket.messages > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className={`flex items-center gap-2 px-3 py-1 rounded-lg border font-medium text-sm ${getStatusColor(ticket.status)}`}>
                  {getStatusIcon(ticket.status)}
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun ticket trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Tickets;
