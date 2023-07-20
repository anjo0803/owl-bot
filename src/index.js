
const {
	Client,
	GatewayIntentBits
} = require('discord.js');

require('dotenv').config();

const $ = require('./settings.json');
const command = require('./command');
const event = require('./event');
const msg = require('./msg');

(async () => {
	const client = new Client({ intents: [
		GatewayIntentBits.Guilds
	] });

	// Register Slash Commands and event handlers
	await command.registerSlashCommands();
	event.registerEvents(client);

	msg.printInfo('Logging in...');
	client.login($.debug.enabled ? process.env.DEBUG_TOKEN : process.env.BOT_TOKEN);
	
})();
