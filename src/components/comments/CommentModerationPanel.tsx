import React, { useState, useEffect } from 'react';
import { Flag, Eye, Trash2, Check, X, AlertTriangle, Shield, MessageCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Comment } from './CommentSystem';

interface ReportedComment extends Comment {
  reportCount: number;
  reportReasons: string[];
  reportedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
}

const CommentModerationPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const [reportedComments, setReportedComments] = useState<ReportedComment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);

  // Mock data pour les commentaires signalés
  const mockReportedComments: ReportedComment[] = [
    {
      id: '1',
      content: 'Ce commentaire contient du contenu inapproprié qui a été signalé par plusieurs utilisateurs.',
      author: {
        id: 'user1',
        name: 'Utilisateur Problématique',
        role: 'user'
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 0,
      likedBy: [],
      replies: [],
      edited: false,
      reported: true,
      pinned: false,
      reportCount: 3,
      reportReasons: ['Contenu inapproprié', 'Spam', 'Harcèlement'],
      reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'pending'
    },
    {
      id: '2',
      content: 'Commentaire avec du spam et des liens non autorisés.',
      author: {
        id: 'user2',
        name: 'Spammer',
        role: 'user'
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 0,
      likedBy: [],
      replies: [],
      edited: false,
      reported: true,
      pinned: false,
      reportCount: 5,
      reportReasons: ['Spam', 'Liens non autorisés'],
      reportedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'pending'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setReportedComments(mockReportedComments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredComments = reportedComments.filter(comment => 
    filter === 'all' || comment.status === filter
  );

  const handleApproveComment = (commentId: string) => {
    setReportedComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, status: 'approved' as const } : comment
    ));
  };

  const handleRejectComment = (commentId: string) => {
    setReportedComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, status: 'rejected' as const } : comment
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce commentaire ?')) return;
    
    setReportedComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, status: 'deleted' as const } : comment
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'deleted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      case 'deleted':
        return 'Supprimé';
      default:
        return status;
    }
  };

  const canModerate = () => {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
  };

  if (!canModerate()) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs et éditeurs peuvent modérer les commentaires.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              Modération des commentaires
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les commentaires signalés et maintenez la qualité des discussions
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tous</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvés</option>
              <option value="rejected">Rejetés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {reportedComments.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">En attente</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {reportedComments.filter(c => c.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approuvés</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {reportedComments.filter(c => c.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejetés</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {reportedComments.length}
              </div>
              <div className="text-sm text-gray-600">Total signalés</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reported Comments */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'pending' ? 'Aucun commentaire en attente' : 'Aucun commentaire trouvé'}
            </h3>
            <p className="text-gray-600">
              {filter === 'pending' 
                ? 'Tous les commentaires signalés ont été traités.'
                : 'Aucun commentaire ne correspond à ce filtre.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Flag className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Commentaire signalé {comment.reportCount} fois
                      </div>
                      <div className="text-sm text-gray-600">
                        Par {comment.author.name} • {comment.reportedAt.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                    {getStatusText(comment.status)}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">{comment.content}</p>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Raisons du signalement :</div>
                  <div className="flex flex-wrap gap-2">
                    {comment.reportReasons.map((reason, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {comment.status === 'pending' && (
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => handleApproveComment(comment.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      icon={<Check className="h-4 w-4" />}
                    >
                      Approuver
                    </Button>
                    <Button
                      onClick={() => handleRejectComment(comment.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      icon={<X className="h-4 w-4" />}
                    >
                      Rejeter
                    </Button>
                    <Button
                      onClick={() => handleDeleteComment(comment.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      icon={<Trash2 className="h-4 w-4" />}
                    >
                      Supprimer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Eye className="h-4 w-4" />}
                    >
                      Voir le contexte
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentModerationPanel;