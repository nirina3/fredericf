import React, { useState } from 'react';
import { Heart, ThumbsUp, ThumbsDown, Laugh, Angry, Frown, Smile } from 'lucide-react';

interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'angry' | 'sad' | 'thumbsUp' | 'thumbsDown';
  count: number;
  users: string[];
  icon: React.ReactNode;
  color: string;
}

interface CommentReactionsProps {
  commentId: string;
  initialReactions?: Partial<Record<Reaction['type'], number>>;
  currentUserReactions?: Reaction['type'][];
  onReact: (commentId: string, reactionType: Reaction['type']) => void;
}

const CommentReactions: React.FC<CommentReactionsProps> = ({
  commentId,
  initialReactions = {},
  currentUserReactions = [],
  onReact
}) => {
  const [showReactions, setShowReactions] = useState(false);
  
  const reactions: Reaction[] = [
    { 
      type: 'like', 
      count: initialReactions.like || 0, 
      users: [], 
      icon: <Heart className="h-4 w-4" />, 
      color: 'text-red-500 bg-red-100' 
    },
    { 
      type: 'thumbsUp', 
      count: initialReactions.thumbsUp || 0, 
      users: [], 
      icon: <ThumbsUp className="h-4 w-4" />, 
      color: 'text-blue-500 bg-blue-100' 
    },
    { 
      type: 'laugh', 
      count: initialReactions.laugh || 0, 
      users: [], 
      icon: <Laugh className="h-4 w-4" />, 
      color: 'text-yellow-500 bg-yellow-100' 
    },
    { 
      type: 'angry', 
      count: initialReactions.angry || 0, 
      users: [], 
      icon: <Angry className="h-4 w-4" />, 
      color: 'text-orange-500 bg-orange-100' 
    },
    { 
      type: 'sad', 
      count: initialReactions.sad || 0, 
      users: [], 
      icon: <Frown className="h-4 w-4" />, 
      color: 'text-purple-500 bg-purple-100' 
    }
  ];

  const handleReaction = (reactionType: Reaction['type']) => {
    onReact(commentId, reactionType);
    setShowReactions(false);
  };

  const isReacted = (reactionType: Reaction['type']) => {
    return currentUserReactions.includes(reactionType);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Heart className={`h-4 w-4 ${isReacted('like') ? 'fill-current text-red-500' : ''}`} />
        <span>{reactions.reduce((sum, r) => sum + r.count, 0)}</span>
      </button>

      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 p-1 z-10">
          <div className="flex space-x-1">
            {reactions.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => handleReaction(reaction.type)}
                className={`p-2 rounded-full transition-colors ${
                  isReacted(reaction.type) ? reaction.color : 'hover:bg-gray-100'
                }`}
                title={reaction.type.charAt(0).toUpperCase() + reaction.type.slice(1)}
              >
                {reaction.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentReactions;