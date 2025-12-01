import { useState, useRef, useEffect } from 'react';
import { Send, Users, Search, MoreVertical, Smile, Paperclip } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

interface AdminUser {
  id: number;
  username: string;
  status: 'online' | 'offline' | 'away';
  role: string;
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Admin1',
      content: 'Bonjour à tous! Prêts pour les entretiens aujourd\'hui?',
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false,
    },
    {
      id: 2,
      sender: 'Vous',
      content: 'Salut! Oui, j\'ai déjà 3 candidats ce matin.',
      timestamp: new Date(Date.now() - 3500000),
      isCurrentUser: true,
    },
    {
      id: 3,
      sender: 'Admin2',
      content: 'Quelqu\'un peut me donner le template pour les questions Legal?',
      timestamp: new Date(Date.now() - 3400000),
      isCurrentUser: false,
    },
    {
      id: 4,
      sender: 'Vous',
      content: 'Je te l\'envoie dans 2 min, je le cherche.',
      timestamp: new Date(Date.now() - 3300000),
      isCurrentUser: true,
    },
    {
      id: 5,
      sender: 'Admin3',
      content: 'N\'oubliez pas de bien valider l\'âge minimum 18 ans!',
      timestamp: new Date(Date.now() - 3000000),
      isCurrentUser: false,
    },
    {
      id: 6,
      sender: 'Admin1',
      content: 'Bonne remarque! J\'en ai refusé 2 hier pour cette raison.',
      timestamp: new Date(Date.now() - 2900000),
      isCurrentUser: false,
    },
  ]);

  const admins: AdminUser[] = [
    { id: 1, username: 'Vous', status: 'online', role: 'Admin' },
    { id: 2, username: 'Admin1', status: 'online', role: 'Master Admin' },
    { id: 3, username: 'Admin2', status: 'online', role: 'Admin' },
    { id: 4, username: 'Admin3', status: 'away', role: 'Admin' },
    { id: 5, username: 'Admin4', status: 'offline', role: 'Modérateur' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'Vous',
        content: message,
        timestamp: new Date(),
        isCurrentUser: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-orange-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'away':
        return 'Absent';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'Inconnu';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chat Interne</h1>
          <p className="text-muted-foreground mt-2">
            Messagerie en temps réel entre administrateurs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Sidebar - Online Users */}
        <div className="col-span-12 lg:col-span-3 bg-card border border-border rounded-xl p-4 h-full overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-foreground">Administrateurs</h2>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {admin.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(
                      admin.status
                    )} border-2 border-card rounded-full`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {admin.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{admin.role}</p>
                </div>
                <span className="text-xs text-muted-foreground">{getStatusText(admin.status)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-12 lg:col-span-9 bg-card border border-border rounded-xl flex flex-col h-full overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Chat Général</h3>
                <p className="text-xs text-muted-foreground">
                  {admins.filter((a) => a.status === 'online').length} membres en ligne
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {!msg.isCurrentUser && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs">
                      {msg.sender.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div
                  className={`flex flex-col max-w-[70%] ${
                    msg.isCurrentUser ? 'items-end' : 'items-start'
                  }`}
                >
                  {!msg.isCurrentUser && (
                    <span className="text-xs font-medium text-muted-foreground mb-1">
                      {msg.sender}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                {msg.isCurrentUser && (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs">V</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Smile className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={!message.trim()}
                className={`p-3 rounded-lg transition-colors ${
                  message.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
