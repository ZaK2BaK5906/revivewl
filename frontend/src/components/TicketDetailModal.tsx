import { useState, useEffect } from 'react';
import { X, Send, Clock, User, Tag, AlertCircle } from 'lucide-react';
import { ticketAPI } from '../services/api';
import toast from 'react-hot-toast';

interface TicketDetailModalProps {
  ticketId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const TicketDetailModal = ({ ticketId, isOpen, onClose, onUpdate }: TicketDetailModalProps) => {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchTicketDetails();
    }
  }, [isOpen, ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.getById(ticketId);
      setTicket(response.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Erreur lors du chargement du ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await ticketAPI.addComment(ticketId, newComment);
      toast.success('Commentaire ajouté');
      setNewComment('');
      await fetchTicketDetails();
      onUpdate();
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await ticketAPI.update(ticketId, { status: newStatus });
      toast.success('Statut mis à jour');
      await fetchTicketDetails();
      onUpdate();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) return;

    try {
      await ticketAPI.delete(ticketId);
      toast.success('Ticket supprimé');
      onClose();
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting ticket:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ouvert':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'En cours':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Résolu':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Fermé':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgente':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'Haute':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Normale':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Basse':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {loading ? 'Chargement...' : ticket?.title}
            </h2>
            {ticket && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {ticket.category}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement du ticket...</p>
            </div>
          </div>
        ) : ticket ? (
          <>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Description
                </h3>
                <p className="text-muted-foreground bg-secondary p-4 rounded-lg">
                  {ticket.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Créé le
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(ticket.created_at)}
                  </p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Créé par
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {ticket.creator?.username || 'Système'}
                  </p>
                </div>
              </div>

              {/* Comments */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Commentaires ({ticket.comments?.length || 0})
                </h3>
                <div className="space-y-3">
                  {ticket.comments && ticket.comments.length > 0 ? (
                    ticket.comments.map((comment: any) => (
                      <div
                        key={comment.id}
                        className="bg-secondary p-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-foreground">
                            {comment.admin?.username || 'Inconnu'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun commentaire pour le moment
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border p-6 space-y-4">
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Envoyer
                </button>
              </form>

              {/* Status Change Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleStatusChange('Ouvert')}
                  disabled={updatingStatus || ticket.status === 'Ouvert'}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Ouvert
                </button>
                <button
                  onClick={() => handleStatusChange('En cours')}
                  disabled={updatingStatus || ticket.status === 'En cours'}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  En cours
                </button>
                <button
                  onClick={() => handleStatusChange('Résolu')}
                  disabled={updatingStatus || ticket.status === 'Résolu'}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Résolu
                </button>
                <button
                  onClick={() => handleStatusChange('Fermé')}
                  disabled={updatingStatus || ticket.status === 'Fermé'}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Fermé
                </button>
                <button
                  onClick={handleDelete}
                  className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12">
            <p className="text-muted-foreground">Ticket introuvable</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailModal;
