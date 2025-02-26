import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const DiscordContext = createContext();

const DISCORD_CLIENT_ID = '1302313461211992199';
const DISCORD_CLIENT_SECRET = '7nagFPBDKK4HVdACmsOM4phsnstm3F5q';

const COOKIE_KEYS = {
  USER: 'discord_user',
  SERVERS: 'discord_servers',
  ACCESS_TOKEN: 'discord_access_token'
};

export function DiscordProvider({ children }) {
  const [discordUser, setDiscordUser] = useState(null);
  const [discordServers, setDiscordServers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Load Discord data from cookies
  useEffect(() => {
    const loadDiscordData = () => {
      const storedUser = Cookies.get(COOKIE_KEYS.USER);
      const storedServers = Cookies.get(COOKIE_KEYS.SERVERS);
      const accessToken = Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);

      if (storedUser && storedServers && accessToken) {
        try {
          setDiscordUser(JSON.parse(storedUser));
          setDiscordServers(JSON.parse(storedServers));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing Discord data:', error);
          clearDiscordData();
        }
      }
      setLoading(false);
    };

    loadDiscordData();
  }, []);

  const clearDiscordData = () => {
    Cookies.remove(COOKIE_KEYS.USER);
    Cookies.remove(COOKIE_KEYS.SERVERS);
    Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
    setDiscordUser(null);
    setDiscordServers([]);
    setIsAuthenticated(false);
  };

  const saveDiscordData = (userData, serversData, accessToken) => {
    // Save to cookies with 7 days expiry
    const options = { expires: 7 };
    Cookies.set(COOKIE_KEYS.USER, JSON.stringify(userData), options);
    Cookies.set(COOKIE_KEYS.SERVERS, JSON.stringify(serversData), options);
    Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, options);

    setDiscordUser(userData);
    setDiscordServers(serversData);
    setIsAuthenticated(true);
  };

  const fetchUserData = async (accessToken) => {
    try {
      // Get user data
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userResponse.json();

      // Get user's guilds
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (!guildsResponse.ok) {
        throw new Error('Failed to fetch guilds');
      }
      
      const guildsData = await guildsResponse.json();

      // Log all guilds for debugging
      console.log('All guilds:', guildsData.map(g => ({
        name: g.name,
        owner: g.owner,
        permissions: g.permissions
      })));

      // Filter guilds where user is owner
      const ownerGuilds = guildsData.filter(guild => {
        const isOwner = guild.owner === true;
        console.log(`Guild ${guild.name}: ${isOwner ? 'Is Owner' : 'Not Owner'}`);
        return isOwner;
      });

      console.log('Owner guilds:', ownerGuilds.map(g => g.name));

      // Save to cookies
      saveDiscordData(userData, ownerGuilds, accessToken);
    } catch (error) {
      console.error('Failed to fetch Discord data:', error);
      clearDiscordData();
      throw error;
    }
  };

  // Handle Discord OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      
      if (location.pathname === '/discord/callback' && code) {
        try {
          // Exchange code for access token
          const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              client_id: DISCORD_CLIENT_ID,
              client_secret: DISCORD_CLIENT_SECRET,
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: window.location.origin + '/discord/callback'
            })
          });

          if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Token response error:', errorData);
            throw new Error('Failed to get access token');
          }

          const tokenData = await tokenResponse.json();
          
          if (tokenData.access_token) {
            await fetchUserData(tokenData.access_token);
            navigate('/discord-ai');
          } else {
            throw new Error('No access token received');
          }
        } catch (error) {
          console.error('Discord authentication failed:', error);
          navigate('/discord-ai');
        }
      }
    };

    handleCallback();
  }, [location, navigate]);

  const loginWithDiscord = () => {
    const REDIRECT_URI = window.location.origin + '/discord/callback';
    const SCOPE = 'identify guilds';
    
    const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPE)}`;
    
    window.location.href = discordUrl;
  };

  const logout = () => {
    clearDiscordData();
  };

  const value = {
    discordUser,
    discordServers,
    isAuthenticated,
    loading,
    loginWithDiscord,
    logout
  };

  return (
    <DiscordContext.Provider value={value}>
      {children}
    </DiscordContext.Provider>
  );
}

export function useDiscord() {
  const context = useContext(DiscordContext);
  if (context === undefined) {
    throw new Error('useDiscord must be used within a DiscordProvider');
  }
  return context;
}
