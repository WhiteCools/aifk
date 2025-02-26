import { RiArrowUpLine, RiArrowDownLine, RiCheckLine } from 'react-icons/ri';

export default function StatsCard({ icon, title, value, trend, detail }) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <RiArrowUpLine className="text-green-500" />;
      case 'down':
        return <RiArrowDownLine className="text-red-500" />;
      case 'active':
        return <RiCheckLine className="text-green-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'active':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-transform duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">{trend === 'active' ? 'Active' : trend}</span>
        </div>
      </div>
      
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
        {title}
      </h3>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {detail}
        </span>
      </div>
    </div>
  );
}
