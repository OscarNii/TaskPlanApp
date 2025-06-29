import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red';
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'from-blue-500/30 to-blue-600/30 text-blue-300 border-blue-400/30',
    green: 'from-green-500/30 to-green-600/30 text-green-300 border-green-400/30',
    orange: 'from-orange-500/30 to-orange-600/30 text-orange-300 border-orange-400/30',
    red: 'from-red-500/30 to-red-600/30 text-red-300 border-red-400/30',
  };

  const iconBgClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-2xl rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${iconBgClasses[color]} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
            trend.startsWith('+') 
              ? 'text-green-300 bg-green-500/20 border border-green-400/30' 
              : 'text-red-300 bg-red-500/20 border border-red-400/30'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-white">
          {value}
        </div>
        <div className="text-sm text-white/70 font-medium">
          {title}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;