import React, { useState } from 'react';
import { Reply, Edit, Trash2, Flag, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import CommentForm from './CommentForm';
import CommentReactions from './CommentReactions';
import { Comment } from './CommentSystem';

interface CommentItemProps {
  comment: Comment;
  depth: number;
  maxDepth: number;
  currentUserId?: string;
  currentUserRole?: string;
  allowReplies: boolean;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onReport: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth,
  maxDepth,
  currentUserId,
  currentUserRole,
  allowReplies,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onReport
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const canEdit = () => {
    return currentUserId && (
      currentUserId === comment.author.id ||
      currentUserRole === 'admin' ||
      currentUserRole === 'editor'
    );
  };

  const canDelete = () => {
    return currentUserId && (
      currentUserId === comment.author.id ||
      currentUserRole === 'admin'
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

  const handleReplySubmit = (content: string) => {
    onReply(comment.id, content);
    setIsReplying(false);
  };

  const handleEditSubmit = (content: string) => {
    onEdit(comment.id, content);
    setIsEditing(false);
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
      <div className={`bg-white rounded-lg border ${comment.pinned ? 'border-orange-200 bg-orange-50' : 'border-gray-200'} p-4`}>
        {comment.pinned && (
          <div className="flex items-center mb-3 text-orange-600 text-sm font-medium">
            <MessageCircle className="h-4 w-4 mr-1" />
            Commentaire épinglé
          </div>
        )}

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">
                  {comment.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900">{comment.author.name}</span>
              {comment.author.role !== 'user' && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(comment.author.role)}`}>
                  {getRoleName(comment.author.role)}
                </span>
              )}
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: fr })}
              </span>
              {comment.edited && (
                <span className="text-xs text-gray-400">(modifié)</span>
              )}
            </div>

            {isEditing ? (
              <CommentForm
                initialValue={comment.content}
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditing(false)}
                placeholder="Modifier votre commentaire..."
                submitText="Sauvegarder"
              />
            ) : (
              <>
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CommentReactions
                      commentId={comment.id}
                      initialReactions={{ like: comment.likes }}
                      currentUserReactions={currentUserId && comment.likedBy.includes(currentUserId) ? ['like'] : []}
                      onReact={(id, type) => {
                        if (type === 'like') onLike(id);
                      }}
                    />

                    {allowReplies && depth < maxDepth && (
                      <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Reply className="h-4 w-4" />
                        <span>Répondre</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {canEdit() && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}

                    {canDelete() && (
                      <button
                        onClick={() => onDelete(comment.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                    {currentUserId && currentUserId !== comment.author.id && (
                      <button
                        onClick={() => onReport(comment.id)}
                        className="text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Signaler"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {isReplying && (
          <div className="mt-4 ml-13">
            <CommentForm
              onSubmit={handleReplySubmit}
              onCancel={() => setIsReplying(false)}
              placeholder={`Répondre à ${comment.author.name}...`}
              submitText="Répondre"
            />
          </div>
        )}
      </div>

      {comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              maxDepth={maxDepth}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              allowReplies={allowReplies}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;