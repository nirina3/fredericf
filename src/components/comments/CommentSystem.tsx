import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Reply, MoreVertical, Flag, Edit, Trash2, Send, Image, Smile } from 'lucide-react';
import Button from '../ui/Button';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'admin' | 'editor' | 'user';
  };
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  likedBy: string[];
  replies: Comment[];
  parentId?: string;
  edited: boolean;
  reported: boolean;
  pinned: boolean;
}

interface CommentSystemProps {
  entityId: string;
  entityType: 'image' | 'blog' | 'directory';
  allowReplies?: boolean;
  allowImages?: boolean;
  maxDepth?: number;
}

const CommentSystem: React.FC<CommentSystemProps> = ({
  entityId,
  entityType,
  allowReplies = true,
  allowImages = false,
  maxDepth = 3
}) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  // Mock data pour la démonstration
  const mockComments: Comment[] = [
    {
      id: '1',
      content: 'Excellente image ! Les frites ont l\'air parfaites. Pourriez-vous partager la recette de cette sauce ?',
      author: {
        id: 'user1',
        name: 'Marie Dubois',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        role: 'user'
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      likedBy: ['user2', 'user3'],
      replies: [
        {
          id: '2',
          content: 'Merci Marie ! C\'est un mélange de mayonnaise, moutarde de Dijon et fines herbes. Le secret c\'est d\'ajouter une pointe d\'ail.',
          author: {
            id: 'chef1',
            name: 'Chef Pierre',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            role: 'editor'
          },
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 8,
          likedBy: ['user1'],
          replies: [],
          edited: false,
          reported: false,
          pinned: false
        }
      ],
      edited: false,
      reported: false,
      pinned: true
    },
    {
      id: '3',
      content: 'Superbe technique de cuisson ! J\'ai essayé chez moi et le résultat est impressionnant. Merci pour le partage !',
      author: {
        id: 'user2',
        name: 'Jean Martin',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        role: 'user'
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 5,
      likedBy: ['user1'],
      replies: [],
      edited: false,
      reported: false,
      pinned: false
    },
    {
      id: '4',
      content: 'Quelqu\'un sait où on peut acheter ce type de friteuse ? Elle a l\'air très professionnelle.',
      author: {
        id: 'user3',
        name: 'Sophie Lambert',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        role: 'user'
      },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 3,
      likedBy: [],
      replies: [],
      edited: false,
      reported: false,
      pinned: false
    }
  ];

  useEffect(() => {
    // Simulation du chargement des commentaires
    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  }, [entityId]);

  const sortComments = (comments: Comment[]) => {
    const sorted = [...comments];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'popular':
        return sorted.sort((a, b) => b.likes - a.likes);
      default:
        return sorted;
    }
  };

  const handleSubmitComment = async (content: string, parentId?: string) => {
    if (!currentUser || !content.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      content: content.trim(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.role
      },
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
      replies: [],
      parentId,
      edited: false,
      reported: false,
      pinned: false
    };

    if (parentId) {
      // Ajouter une réponse
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, newCommentObj]
          };
        }
        return comment;
      }));
      setReplyingTo(null);
    } else {
      // Ajouter un nouveau commentaire
      setComments(prev => [newCommentObj, ...prev]);
    }

    setNewComment('');

    // Notification de succès
    addNotification({
      type: 'success',
      title: 'Commentaire ajouté',
      message: parentId ? 'Votre réponse a été publiée.' : 'Votre commentaire a été publié.',
      category: 'content',
      priority: 'low'
    });
  };

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (!currentUser) return;

    const updateLike = (comment: Comment): Comment => {
      if (comment.id === commentId) {
        const isLiked = comment.likedBy.includes(currentUser.id);
        return {
          ...comment,
          likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          likedBy: isLiked 
            ? comment.likedBy.filter(id => id !== currentUser.id)
            : [...comment.likedBy, currentUser.id]
        };
      }
      return {
        ...comment,
        replies: comment.replies.map(updateLike)
      };
    };

    setComments(prev => prev.map(updateLike));
  };

  const handleEditComment = (commentId: string, newContent: string) => {
    const updateComment = (comment: Comment): Comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content: newContent,
          edited: true,
          updatedAt: new Date()
        };
      }
      return {
        ...comment,
        replies: comment.replies.map(updateComment)
      };
    };

    setComments(prev => prev.map(updateComment));
    setEditingComment(null);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;

    const removeComment = (comments: Comment[]): Comment[] => {
      return comments.filter(comment => comment.id !== commentId)
        .map(comment => ({
          ...comment,
          replies: removeComment(comment.replies)
        }));
    };

    setComments(prev => removeComment(prev));

    addNotification({
      type: 'success',
      title: 'Commentaire supprimé',
      message: 'Le commentaire a été supprimé avec succès.',
      category: 'content',
      priority: 'low'
    });
  };

  const handleReportComment = (commentId: string) => {
    addNotification({
      type: 'info',
      title: 'Commentaire signalé',
      message: 'Merci pour votre signalement. Nous examinerons ce commentaire.',
      category: 'system',
      priority: 'medium'
    });
  };

  const canEditComment = (comment: Comment) => {
    return currentUser && (
      currentUser.id === comment.author.id ||
      currentUser.role === 'admin' ||
      currentUser.role === 'editor'
    );
  };

  const canDeleteComment = (comment: Comment) => {
    return currentUser && (
      currentUser.id === comment.author.id ||
      currentUser.role === 'admin'
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-yellow-600 bg-yellow-100';
      case 'editor':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Éditeur';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">Chargement des commentaires...</span>
      </div>
    );
  }

  const sortedComments = sortComments(comments.filter(c => !c.parentId));
  const totalComments = comments.length + comments.reduce((sum, c) => sum + c.replies.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Commentaires ({totalComments})
        </h3>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="newest">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="popular">Plus populaires</option>
        </select>
      </div>

      {/* New Comment Form */}
      {currentUser ? (
        <CommentForm
          onSubmit={(content) => handleSubmitComment(content)}
          placeholder="Ajouter un commentaire..."
          submitText="Publier"
          allowImages={allowImages}
        />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Connectez-vous pour commenter</h4>
          <p className="text-gray-600 mb-4">Rejoignez la conversation et partagez votre avis !</p>
          <Button>Se connecter</Button>
        </div>
      )}

      {/* Comments List */}
      {sortedComments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun commentaire</h4>
          <p className="text-gray-600">Soyez le premier à laisser un commentaire !</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              maxDepth={maxDepth}
              currentUserId={currentUser?.id}
              currentUserRole={currentUser?.role}
              allowReplies={allowReplies}
              onReply={(commentId, content) => handleSubmitComment(content, commentId)}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
              onReport={handleReportComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSystem;