import { useState } from 'react';
import { RiVipCrownLine, RiTimeLine, RiInformationLine } from 'react-icons/ri';
import ActivityChart from '../components/dashboard/ActivityChart';
import NotificationList from '../components/dashboard/NotificationList';
import StatsCard from '../components/dashboard/StatsCard';

export default function Dashboard() {
  const [subscriptionStatus] = useState({
    type: 'Premium',
    expiryDate: '2024-12-31',
    daysLeft: 120
  });

  const [adminMessages] = useState([
    {
      id: 1,
      title: 'System Maintenance',
      message: 'Scheduled maintenance on January 15th, 2024',
      date: '2024-01-10'
    },
    {
      id: 2,
      title: 'New Features Available',
      message: 'Check out our latest AI-powered features',
      date: '2024-01-08'
    }
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-blue-100">Monitor your subscription and stay updated with the latest information</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Subscription Status */}
        <StatsCard
          icon={<RiVipCrownLine className="text-yellow-500" />}
          title="Subscription Status"
          value={subscriptionStatus.type}
          trend="active"
          detail={`Active until ${new Date(subscriptionStatus.expiryDate).toLocaleDateString()}`}
        />

        {/* Days Until Expiry */}
        <StatsCard
          icon={<RiTimeLine className="text-blue-500" />}
          title="Days Until Expiry"
          value={subscriptionStatus.daysLeft}
          trend="neutral"
          detail="Days remaining in your subscription"
        />

        {/* Admin Updates */}
        <StatsCard
          icon={<RiInformationLine className="text-purple-500" />}
          title="Admin Updates"
          value={adminMessages.length}
          trend="up"
          detail="New messages from admin"
        />
      </div>

      {/* Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Usage Activity</h2>
          <ActivityChart />
        </div>

        {/* Admin Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Admin Messages</h2>
          <div className="space-y-4">
            {adminMessages.map(message => (
              <div key={message.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium">{message.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{message.message}</p>
                <span className="text-sm text-gray-500">{message.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
