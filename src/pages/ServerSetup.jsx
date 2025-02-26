import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDiscord } from '../context/DiscordContext';
import { RiDiscordFill, RiSettings4Line, RiAddLine } from 'react-icons/ri';
import { getSetupInfo, saveSetupInfo } from '../services/mongoService';

export default function ServerSetup() {
  const { isAuthenticated, loginWithDiscord, discordServers } = useDiscord();
  const [servers, setServers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSetup, setNewSetup] = useState({
    serverId: '',
    setupType: 'channel',
    channelId: ''
  });
  const [loading, setLoading] = useState(true);

  const hasServerAccess = (serverId) => {
    const server = discordServers.find(s => s.id === serverId);
    if (!server) return false;
    
    // Check if user is owner
    if (server.owner === true) {
      console.log(`User is owner of server ${server.name}`);
      return true;
    }

    // Check if user has admin permissions
    const permissions = BigInt(server.permissions);
    const ADMIN_PERMISSION = BigInt(0x8);
    const hasAdmin = (permissions & ADMIN_PERMISSION) === ADMIN_PERMISSION;
    
    console.log(`Server ${server.name} permission check:`, {
      isOwner: server.owner,
      permissions: server.permissions,
      hasAdmin
    });

    return hasAdmin;
  };

  // Fetch server setups
  useEffect(() => {
    const fetchData = async () => {
      if (discordServers.length > 0) {
        setLoading(true);
        try {
          // Filter servers where user has access
          const accessibleServers = discordServers.filter(server => hasServerAccess(server.id));

          // Fetch setup info for accessible servers
          const setups = await Promise.all(
            accessibleServers.map(async (server) => {
              const setup = await getSetupInfo(server.id);
              if (setup) {
                return {
                  id: server.id,
                  name: server.name,
                  setupType: setup.setup_type,
                  channelId: setup.channel_or_category_id,
                  status: 'active'
                };
              }
              return null;
            })
          );
          setServers(setups.filter(setup => setup !== null));
        } catch (error) {
          console.error('Failed to fetch server setups:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, discordServers]);

  const handleAddSetup = async () => {
    if (!hasServerAccess(newSetup.serverId)) return;

    if (newSetup.serverId && newSetup.channelId) {
      try {
        await saveSetupInfo(
          newSetup.serverId,
          newSetup.setupType,
          parseInt(newSetup.channelId)
        );

        const selectedServer = discordServers.find(s => s.id === newSetup.serverId);
        setServers([...servers, {
          id: newSetup.serverId,
          name: selectedServer?.name || 'Unknown Server',
          setupType: newSetup.setupType,
          channelId: newSetup.channelId,
          status: 'active'
        }]);
        setNewSetup({ serverId: '', setupType: 'channel', channelId: '' });
        setShowAddModal(false);
      } catch (error) {
        console.error('Failed to add server setup:', error);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RiDiscordFill className="mx-auto text-6xl text-[#5865F2] mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect with Discord
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your Discord account to manage server setups
          </p>
          <button
            onClick={loginWithDiscord}
            className="inline-flex items-center px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
          >
            <RiDiscordFill className="mr-2 text-xl" />
            Login with Discord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Server Setup</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
        >
          <RiAddLine className="mr-2" />
          Add Server Setup
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-[#5865F2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Server List */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {discordServers.map((server) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {server.icon ? (
                    <img
                      src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                      alt={server.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {server.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {server.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {hasServerAccess(server.id) ? 'Admin Access' : 'No Admin Access'}
                    </p>
                  </div>
                </div>
                {servers.find(s => s.id === server.id) && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                    Configured
                  </span>
                )}
              </div>
              {servers.find(s => s.id === server.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Setup Type:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {servers.find(s => s.id === server.id)?.setupType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Channel ID:</span>
                    <span className="font-mono text-gray-900 dark:text-gray-100">
                      {servers.find(s => s.id === server.id)?.channelId}
                    </span>
                  </div>
                </div>
              )}
              {!hasServerAccess(server.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-red-500 dark:text-red-400">
                    You need administrator permissions or be the owner to configure this server.
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Setup Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Add Server Setup
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-200">
                  Select Server
                </label>
                <select
                  value={newSetup.serverId}
                  onChange={(e) => setNewSetup({ ...newSetup, serverId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select a server</option>
                  {discordServers
                    .filter(server => hasServerAccess(server.id))
                    .map(server => (
                      <option key={server.id} value={server.id}>
                        {server.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-200">
                  Setup Type
                </label>
                <select
                  value={newSetup.setupType}
                  onChange={(e) => setNewSetup({ ...newSetup, setupType: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="channel">Channel</option>
                  <option value="category">Category</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-200">
                  Channel/Category ID
                </label>
                <input
                  type="text"
                  value={newSetup.channelId}
                  onChange={(e) => setNewSetup({ ...newSetup, channelId: e.target.value })}
                  placeholder="Enter ID"
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSetup}
                  disabled={!hasServerAccess(newSetup.serverId)}
                  className={`px-4 py-2 bg-[#5865F2] text-white rounded-lg transition-colors ${
                    !hasServerAccess(newSetup.serverId)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-[#4752C4]'
                  }`}
                >
                  Add Setup
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
