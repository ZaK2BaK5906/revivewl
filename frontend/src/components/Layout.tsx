import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  MessageSquare,
  Ticket,
  Settings,
  LogOut,
  Menu,
  FileEdit,
  X,
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { admin, logout } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Nouvelle WL', href: '/whitelist/new', icon: FileText },
    { name: 'Historique WL', href: '/whitelist/history', icon: FileText },
    { name: 'Statistiques', href: '/statistics', icon: BarChart3 },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Tickets', href: '/tickets', icon: Ticket },
    { name: 'Templates', href: '/templates', icon: FileEdit },
  ];

  if (admin?.is_master) {
    navigation.push({ name: 'Admins', href: '/admins', icon: Users });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Revive RP
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center mb-4 p-3 bg-secondary rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                {admin?.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{admin?.username}</p>
                <p className="text-xs text-muted-foreground">
                  {admin?.is_master ? '👑 Master Admin' : '🛡️ Administrateur'}
                </p>
              </div>
            </div>
            <Link
              to="/settings"
              className="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg mb-2 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Link>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`${sidebarOpen ? 'lg:pl-64' : ''}`}>
        {/* Top bar */}
        <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
