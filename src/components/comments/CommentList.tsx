import React from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import { Comment } from './CommentSystem';

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  currentUserRole?: string;
  allowReplies: boolean;
  maxDepth: number;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onReport: (commentId: string) => void;
  emptyMessage?: string;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  currentUserId,
  currentUserRole,
  allowReplies,
  maxDepth,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onReport,
  emptyMessage = 'Soyez le premier à laisser un commentaire !'
}) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun commentaire</h4>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          depth={0}
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
  );
};

export default CommentList;