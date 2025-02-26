import { RiInformationLine, RiCheckLine, RiErrorWarningLine } from 'react-icons/ri';

export default function NotificationList({ notifications = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'info':
        return <RiInformationLine className="text-blue-500 text-xl" />;
      case 'success':
        return <RiCheckLine className="text-green-500 text-xl" />;
      case 'warning':
        return <RiErrorWarningLine className="text-yellow-500 text-xl" />;
      default:
        return <RiInformationLine className="text-blue-500 text-xl" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          No notifications to display
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {getIcon(notification.type)}
            </div>
            <div className="flex-grow">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {notification.message}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                {formatDate(notification.date)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
