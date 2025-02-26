import { Link, useLocation } from 'react-router-dom';
import { 
  RiDashboardLine, 
  RiUserLine, 
  RiPriceTag3Line, 
  RiQuestionLine, 
  RiContactsLine,
  RiDiscordFill,
  RiRobot2Line,
  RiSettings4Line,
  RiServerLine
} from 'react-icons/ri';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: RiDashboardLine, label: 'Dashboard' },
    { 
      header: 'Discord AI',
      items: [
        { path: '/discord', icon: RiDiscordFill, label: 'Overview' },
        { path: '/discord-ai', icon: RiRobot2Line, label: 'AI Management' },
        { path: '/qa-management', icon: RiQuestionLine, label: 'Q&A Database' },
        { path: '/server-setup', icon: RiServerLine, label: 'Server Setup' },
      ]
    },
    { 
      header: 'Account',
      items: [
        { path: '/profile', icon: RiUserLine, label: 'Profile' },
        { path: '/pricing', icon: RiPriceTag3Line, label: 'Subscription' },
        { path: '/contact', icon: RiContactsLine, label: 'Contact' },
      ]
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transition-transform duration-300 transform">
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center space-x-2">
          <RiDiscordFill className="text-2xl text-[#5865F2]" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Flazu
          </h1>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
        {menuItems.map((section, idx) => (
          <div key={idx}>
            {section.header ? (
              <>
                <h2 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {section.header}
                </h2>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                          active
                            ? 'bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className={`text-xl ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#5865F2] dark:group-hover:text-[#5865F2]'}`} />
                        <span className="font-medium">{item.label}</span>
                        {active && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <Link
                to={section.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(section.path)
                    ? 'bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <section.icon className={`text-xl ${isActive(section.path) ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#5865F2] dark:group-hover:text-[#5865F2]'}`} />
                <span className="font-medium">{section.label}</span>
                {isActive(section.path) && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Pro Badge */}
      <div className="absolute bottom-8 left-4 right-4">
        <div className="p-4 rounded-lg bg-gradient-to-r from-[#5865F2] to-[#4752C4]">
          <h3 className="text-white font-medium mb-1">Upgrade to Pro</h3>
          <p className="text-blue-100 text-sm">Get access to all features</p>
          <Link
            to="/pricing"
            className="mt-3 block w-full py-2 bg-white text-[#5865F2] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200 text-center"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </aside>
  );
}
