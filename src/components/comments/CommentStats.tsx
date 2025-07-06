import React from 'react';
import { MessageCircle, Heart, Users, TrendingUp } from 'lucide-react';

interface CommentStatsProps {
  totalComments: number;
  totalLikes: number;
  activeUsers: number;
  engagementRate: number;
}

const CommentStats: React.FC<CommentStatsProps> = ({
  totalComments,
  totalLikes,
  activeUsers,
  engagementRate
}) => {
  const stats = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      label: 'Commentaires',
      value: totalComments,
      color: 'bg-blue-500'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      label: 'J\'aime',
      value: totalLikes,
      color: 'bg-red-500'
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: 'Participants',
      value: activeUsers,
      color: 'bg-green-500'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: 'Engagement',
      value: `${engagementRate}%`,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className={`${stat.color} p-2 rounded-lg text-white mr-3`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentStats;