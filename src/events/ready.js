/**
 * @module events/ready
 */

const {
	Client,
	Events
} = require('discord.js');

const { BotEvent } = require('./event');
const msg = require('../msg');

/**
 * Prints a message to the console to announce that the login has completed successfully.
 * @param {Client} client - The logged-in client instance for the bot.
 */
function readyMessage(client) {
	msg.printInfo(`Successfully logged in as ${client.user.tag}!`);
}

module.exports = new BotEvent(Events.ClientReady,
	readyMessage,
	true);
