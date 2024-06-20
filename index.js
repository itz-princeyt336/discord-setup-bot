const { Client, Intents } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] // Add GUILD_MESSAGES intent for message handling
});

// Made By Ghost Planet

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('!setup', { type: 'LISTENING' });
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return; // Ignore messages that don't start with '!' or are from bots

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'setup') {
        try {
            const setupCommand = require(`./commands/setup`);
            await setupCommand.execute(message, args);
        } catch (error) {
            console.error('Error executing setup command:', error);
            message.reply('There was an error while setting up the server.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
