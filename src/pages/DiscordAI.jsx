import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useDiscord } from '../context/DiscordContext';
import { RiDiscordFill, RiSettings4Line, RiAddLine, RiDeleteBin7Line, RiShieldLine, RiRobot2Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const BOT_ID = '1302313461211992199';

export default function DiscordAI() {
  const { darkMode } = useTheme();
  const { user: authUser } = useAuth();
  const { isAuthenticated: isDiscordAuthenticated, loginWithDiscord, discordServers, discordUser } = useDiscord();
  const [serversWithBot, setServersWithBot] = useState(new Set());

  // Check which servers have the bot
  useEffect(() => {
    const checkBotPresence = async () => {
      if (!discordServers.length) return;

      const botPresence = new Set();
      
      for (const server of discordServers) {
        try {
          const response = await fetch(`https://discord.com/api/v10/guilds/${server.id}/members/${BOT_ID}`, {
            headers: {
              Authorization: `Bot ${BOT_ID}`
            }
          });
          
          if (response.ok) {
            botPresence.add(server.id);
          }
        } catch (error) {
          console.error(`Failed to check bot presence in server ${server.id}:`, error);
        }
      }

      setServersWithBot(botPresence);
    };

    if (isDiscordAuthenticated) {
      checkBotPresence();
    }
  }, [discordServers, isDiscordAuthenticated]);

  const inviteBot = (serverId) => {
    const PERMISSIONS = '8'; // Administrator permissions
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${BOT_ID}&permissions=${PERMISSIONS}&scope=bot%20applications.commands&guild_id=${serverId}`;
    window.open(inviteUrl, '_blank');
  };

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RiDiscordFill className="mx-auto text-6xl text-[#5865F2] mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to your account to access Discord AI features
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!isDiscordAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RiDiscordFill className="mx-auto text-6xl text-[#5865F2] mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect with Discord
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your Discord account to access AI features
          </p>
          <button
            onClick={loginWithDiscord}
            className="inline-flex items-center px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
          >
            <RiDiscordFill className="mr-2 text-xl" />
            Connect Discord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Discord AI Dashboard</h2>
          {discordUser && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Connected as {discordUser.username}#{discordUser.discriminator}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Server Setup Card */}
        <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${discordServers.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl transition-shadow'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <RiSettings4Line className="text-2xl text-[#5865F2]" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Server Setup
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Configure channels and categories for your Discord bot
          </p>
          {discordServers.length > 0 ? (
            <Link
              to="/server-setup"
              className="inline-flex items-center px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
            >
              <RiSettings4Line className="mr-2" />
              Configure Servers
            </Link>
          ) : (
            <p className="text-sm text-red-500 dark:text-red-400">
              You need admin access to at least one server
            </p>
          )}
        </div>

        {/* Q&A Management Card */}
        <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${discordServers.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl transition-shadow'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <RiAddLine className="text-2xl text-[#5865F2]" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Q&A Management
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Manage your server's FAQ database with custom questions and answers
          </p>
          {discordServers.length > 0 ? (
            <Link
              to="/qa-management"
              className="inline-flex items-center px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
            >
              <RiAddLine className="mr-2" />
              Manage Q&A
            </Link>
          ) : (
            <p className="text-sm text-red-500 dark:text-red-400">
              You need admin access to at least one server
            </p>
          )}
        </div>

        {/* Admin Servers Card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <RiShieldLine className="text-2xl text-[#5865F2]" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your Admin Servers
            </h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {discordServers.length > 0 ? (
              discordServers.map(server => (
                <div
                  key={server.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
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
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {server.name}
                    </span>
                  </div>
                  {serversWithBot.has(server.id) ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded flex items-center">
                      <RiRobot2Line className="mr-1" />
                      Bot Active
                    </span>
                  ) : (
                    <button
                      onClick={() => inviteBot(server.id)}
                      className="px-2 py-1 text-xs bg-[#5865F2] text-white rounded hover:bg-[#4752C4] transition-colors flex items-center"
                    >
                      <RiRobot2Line className="mr-1" />
                      Add Bot
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                No admin servers found. You need admin permissions to manage AI features.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
