const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const TOKEN = 'YOUR_DISCORD_BOT_TOKEN';
const GAMEPASS_ID = '12345678'; // Your Roblox Game Pass ID

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!link')) {
    const args = message.content.split(' ');
    const robloxUsername = args[1];

    if (!robloxUsername) {
      return message.reply('Usage: `!link <robloxUsername>`');
    }

    try {
      // Get Roblox userId
      const userRes = await axios.get(`https://users.roblox.com/v1/usernames/users`, {
        data: {
          usernames: [robloxUsername],
        }
      });

      const userId = userRes.data.data[0]?.id;
      if (!userId) return message.reply("User not found.");

      // Check Game Pass ownership
      const gamepassRes = await axios.get(`https://inventory.roblox.com/v1/users/${userId}/items/GamePass/${GAMEPASS_ID}`);

      if (gamepassRes.data.data.length > 0) {
        // User owns the Game Pass
        message.reply(`✅ ${robloxUsername} owns the Game Pass! You’ve been verified.`);
        // Optionally: give role, log, etc.
      } else {
        message.reply(`❌ ${robloxUsername} does not own the Game Pass.`);
      }
    } catch (err) {
      console.error(err);
      message.reply("An error occurred. Try again later.");
    }
  }
});

client.login(TOKEN);
