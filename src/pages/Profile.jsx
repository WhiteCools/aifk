import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDiscord } from '../context/DiscordContext';
import { RiDiscordFill, RiUser3Line, RiMailLine, RiLockLine, RiShieldLine } from 'react-icons/ri';

export default function Profile() {
  const { user, updatePassword } = useAuth();
  const { discordUser, isAuthenticated: isDiscordAuthenticated, loginWithDiscord, logout: logoutDiscord } = useDiscord();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(newPassword);
      setMessage('Password updated successfully');
      setError('');
      setNewPassword('');
    } catch (error) {
      setError('Failed to update password');
      setMessage('');
    }
  };

  const handleDiscordDisconnect = () => {
    logoutDiscord();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Profile Settings</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <RiUser3Line className="mr-2" />
            Account Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="flex items-center space-x-2">
                <RiMailLine className="text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">{user?.email}</span>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Update Password
              </button>
              {message && (
                <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
              )}
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </form>
          </div>
        </div>

        {/* Discord Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <RiDiscordFill className="mr-2" />
            Discord Integration
          </h3>
          {isDiscordAuthenticated && discordUser ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {discordUser.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`}
                    alt={discordUser.username}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      {discordUser.username.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {discordUser.username}#{discordUser.discriminator}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Discord Account Connected
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleDiscordDisconnect}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <RiDiscordFill className="mr-2" />
                  Disconnect Discord
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <RiDiscordFill className="mx-auto text-4xl text-[#5865F2] mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect your Discord account to manage servers and Q&A
              </p>
              <button
                onClick={loginWithDiscord}
                className="w-full px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <RiDiscordFill className="mr-2" />
                Connect Discord Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
