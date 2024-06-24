const { MessageEmbed, Permissions } = require('discord.js');

async function execute(message, args) {
    // Check if the message is sent in a guild (server)
    if (!message.guild) {
        return message.reply('This command is only available in servers.');
    }

    // Check if the bot has permission to manage roles and channels
    if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES) || !message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
        return message.reply('I need the "Manage Roles" and "Manage Channels" permissions to set up the server.');
    }

    // Check if the user has permission to manage roles
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
        return message.reply('You need the "Manage Roles" permission to use this command.');
    }

    try {
        // Clear existing channels and roles (if any)
        await clearGuild(message.guild);

        // Create categories
        const informationCategory = await createCategory(message.guild, 'Information');
        const generalCategory = await createCategory(message.guild, 'General');
        const voiceCategory = await createCategory(message.guild, 'Voice Room');

        // Create channels in categories
        await createChannel(message.guild, informationCategory, 'Announcement', 'text');
        await createChannel(message.guild, informationCategory, 'Rules', 'text');
        await createChannel(message.guild, informationCategory, 'Poll', 'text');

        await createChannel(message.guild, generalCategory, 'Chit Chat', 'text');
        await createChannel(message.guild, generalCategory, 'Media', 'text');
        await createChannel(message.guild, generalCategory, 'Bot Commands', 'text');

        await createVoiceChannel(message.guild, voiceCategory, 'VC 1');
        await createVoiceChannel(message.guild, voiceCategory, 'VC 2');

        // Create roles
        await createRole(message.guild, 'owner', '#3498db');
        await createRole(message.guild, 'head-admin', '#9b59b6');
        await createRole(message.guild, 'admin', '#e74c3c');
        await createRole(message.guild, 'head-mod', '#2ecc71');
        await createRole(message.guild, 'mod', '#f39c12');
        await createRole(message.guild, 'trail-mod', '#1abc9c');
        await createRole(message.guild, 'members', '#95a5a6');

        // Send completion message
        const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Server Setup Completed')
            .setDescription('The server setup has been completed successfully.');

        return message.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error setting up server:', error);
        return message.reply('There was an error while setting up the server. Please check permissions and try again.');
    }
}

async function clearGuild(guild) {
    // Delete all channels
    await Promise.all(guild.channels.cache.map(async channel => {
        try {
            await channel.delete();
        } catch (error) {
            console.error(`Error deleting channel ${channel.name}:`, error);
        }
    }));

    // Delete all roles except @everyone
    await Promise.all(guild.roles.cache.filter(role => role.name !== '@everyone').map(async role => {
        try {
            await role.delete();
        } catch (error) {
            console.error(`Error deleting role ${role.name}:`, error);
        }
    }));
}

async function createCategory(guild, name) {
    return await guild.channels.create(name, {
        type: 'GUILD_CATEGORY',
        reason: 'Setup command executed'
    });
}

async function createChannel(guild, category, name, type) {
    return await guild.channels.create(name, {
        type: type.toUpperCase(),
        parent: category.id,
        reason: 'Setup command executed'
    });
}

async function createVoiceChannel(guild, category, name) {
    return await createChannel(guild, category, name, 'GUILD_VOICE');
}

async function createRole(guild, name, color) {
    return await guild.roles.create({
        name: name,
        color: color,
        reason: 'Setup command executed'
    });
}

module.exports = {
    name: 'setup',
    description: 'Sets up a basic Discord server structure.',
    execute
};

// All Credits Goes to Friday by Ghost Planet

/*

███╗   ███╗ █████╗ ██████╗ ███████╗    ██████╗ ██╗   ██╗    ███████╗██████╗ ██╗██████╗  █████╗ ██╗   ██╗
████╗ ████║██╔══██╗██╔══██╗██╔════╝    ██╔══██╗╚██╗ ██╔╝    ██╔════╝██╔══██╗██║██╔══██╗██╔══██╗╚██╗ ██╔╝
██╔████╔██║███████║██║  ██║█████╗      ██████╔╝ ╚████╔╝     █████╗  ██████╔╝██║██║  ██║███████║ ╚████╔╝ 
██║╚██╔╝██║██╔══██║██║  ██║██╔══╝      ██╔══██╗  ╚██╔╝      ██╔══╝  ██╔══██╗██║██║  ██║██╔══██║  ╚██╔╝  
██║ ╚═╝ ██║██║  ██║██████╔╝███████╗    ██████╔╝   ██║       ██║     ██║  ██║██║██████╔╝██║  ██║   ██║   
╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝    ╚═════╝    ╚═╝       ╚═╝     ╚═╝  ╚═╝╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   
                                                                                                        
*/
