const BOT_ID = '1302313461211992199';

// Check if bot is in a server
export const checkBotPresence = async (serverId) => {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members/${BOT_ID}`, {
      headers: {
        Authorization: `Bot ${BOT_ID}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error(`Failed to check bot presence in server ${serverId}:`, error);
    return false;
  }
};

// Generate bot invite URL
export const getBotInviteUrl = (serverId) => {
  const PERMISSIONS = '8'; // Administrator permissions
  return `https://discord.com/api/oauth2/authorize?client_id=${BOT_ID}&permissions=${PERMISSIONS}&scope=bot%20applications.commands&guild_id=${serverId}`;
};

// Check if bot is present in multiple servers
export const checkBotPresenceInServers = async (servers) => {
  const botPresence = new Set();
  
  for (const server of servers) {
    const isPresent = await checkBotPresence(server.id);
    if (isPresent) {
      botPresence.add(server.id);
    }
  }

  return botPresence;
};
