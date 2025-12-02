import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Crown,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Save,
  X,
} from 'lucide-react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: 'Master Admin' | 'Admin' | 'Modérateur';
  createdAt: Date;
  lastLogin: Date;
  permissions: {
    whitelistCreate: boolean;
    whitelistEdit: boolean;
    whitelistDelete: boolean;
    whitelistView: boolean;
    templateManage: boolean;
    adminManage: boolean;
    chatAccess: boolean;
    ticketManage: boolean;
    settingsManage: boolean;
    rulesEdit: boolean;
    statisticsView: boolean;
    backupManage: boolean;
    webhookManage: boolean;
    logsView: boolean;
  };
}

const AdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAll();
      setAdmins(response.data || []);
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      toast.error('Erreur lors du chargement des administrateurs');
    } finally {
      setLoading(false);
    }
  };

  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Modérateur',
  });

  const permissionLabels = {
    whitelistCreate: 'Créer des whitelists',
    whitelistEdit: 'Modifier des whitelists',
    whitelistDelete: 'Supprimer des whitelists',
    whitelistView: 'Voir les whitelists',
    templateManage: 'Gérer les templates',
    adminManage: 'Gérer les administrateurs',
    chatAccess: 'Accès au chat',
    ticketManage: 'Gérer les tickets',
    settingsManage: 'Gérer les paramètres',
    rulesEdit: 'Éditer le règlement',
    statisticsView: 'Voir les statistiques',
    backupManage: 'Gérer les sauvegardes',
    webhookManage: 'Gérer les webhooks',
    logsView: 'Voir les logs',
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Master Admin':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'Admin':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'Modérateur':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Master Admin':
        return <Crown className="w-4 h-4" />;
      case 'Admin':
        return <Shield className="w-4 h-4" />;
      case 'Modérateur':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return formatDate(dateObj);
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAdmin = async () => {
    if (newAdmin.username.trim() && newAdmin.email.trim() && newAdmin.password.trim()) {
      try {
        const response = await adminAPI.create({
          username: newAdmin.username,
          email: newAdmin.email,
          password: newAdmin.password,
          role: newAdmin.role,
        });
        setAdmins([...admins, response.data]);
        setNewAdmin({ username: '', email: '', password: '', role: 'Modérateur' });
        setIsCreating(false);
        toast.success('Administrateur créé avec succès');
      } catch (error: any) {
        console.error('Error creating admin:', error);
        toast.error('Erreur lors de la création de l\'administrateur');
      }
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    try {
      await adminAPI.delete(id);
      setAdmins(admins.filter((a) => a.id !== id));
      toast.success('Administrateur supprimé');
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const togglePermission = async (adminId: number, permission: keyof Admin['permissions']) => {
    const admin = admins.find((a) => a.id === adminId);
    if (!admin) return;

    const updatedPermissions = {
      ...admin.permissions,
      [permission]: !admin.permissions[permission],
    };

    try {
      await adminAPI.updatePermissions(adminId, updatedPermissions);
      setAdmins(
        admins.map((a) => {
          if (a.id === adminId) {
            return { ...a, permissions: updatedPermissions };
          }
          return a;
        })
      );
      toast.success('Permission mise à jour');
    } catch (error: any) {
      console.error('Error updating permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des administrateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestion des Administrateurs</h1>
              <p className="text-muted-foreground mt-1">
                Réservé au Master Admin - Gérer les comptes et permissions
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel Admin
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Crown className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-500 mb-1">Accès Master Admin Requis</h3>
            <p className="text-sm text-yellow-400/80">
              Cette page est réservée aux Master Admins. Toute modification des permissions ou création
              d'admin sera enregistrée dans les logs de sécurité.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Master Admins</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {admins.filter((a) => a.role === 'Master Admin').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">Administrateurs</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {admins.filter((a) => a.role === 'Admin').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-green-500" />
            <span className="text-sm text-muted-foreground">Modérateurs</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {admins.filter((a) => a.role === 'Modérateur').length}
          </p>
        </div>
      </div>

      {/* Create Admin Form */}
      {isCreating && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Créer un Administrateur</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nom d'utilisateur *
              </label>
              <input
                type="text"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: admin2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="admin@revive-rp.local"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mot de passe *
              </label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Rôle</label>
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Modérateur">Modérateur</option>
                <option value="Admin">Admin</option>
                <option value="Master Admin">Master Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCreateAdmin}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Créer
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewAdmin({ username: '', email: '', password: '', role: 'Modérateur' });
                }}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <X className="w-4 h-4 inline mr-2" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un administrateur..."
          className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Admins List */}
      <div className="space-y-4">
        {filteredAdmins.map((admin) => (
          <div key={admin.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${getRoleColor(
                    admin.role
                  )}`}
                >
                  {getRoleIcon(admin.role)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">{admin.username}</h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getRoleColor(
                        admin.role
                      )}`}
                    >
                      {getRoleIcon(admin.role)}
                      {admin.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {admin.email}
                    </span>
                    <span>Créé le {formatDate(admin.createdAt)}</span>
                    <span>Dernière connexion: {formatTime(admin.lastLogin)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingId(editingId === admin.id ? null : admin.id)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-blue-500" />
                </button>
                {admin.role !== 'Master Admin' && (
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Permissions */}
            {editingId === admin.id && (
              <div className="border-t border-border pt-4 mt-4">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Permissions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => togglePermission(admin.id, key as keyof Admin['permissions'])}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                        admin.permissions[key as keyof Admin['permissions']]
                          ? 'bg-green-500/10 border-green-500/20 text-green-400'
                          : 'bg-secondary border-border text-muted-foreground'
                      }`}
                    >
                      {admin.permissions[key as keyof Admin['permissions']] ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAdmins.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun administrateur trouvé</p>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
