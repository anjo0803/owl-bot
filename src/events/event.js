/**
 * 
 * @module events/event
 */

const {
	Client,
	Events
} = require('discord.js');

const loadfiles = require('../file-loader');

/**
 * Configures the given client instance to listen to the events specified in the source files in
 * the `/src/events` directory and handle them accordingly.
 * @arg {Client} client - The client instance for the bot.
 */
exports.registerEvents = (client) => {
	let events = loadfiles('events', BotEvent);

	for(let event of events)
		if(event.once) client.once(event.name, (...args) => event.handle(...args));
		else client.on(event.name, (...args) => event.handle(...args));
}

/**
 * 
 */
class BotEvent {
	/**
	 * 
	 * @arg {string} name - Name of the Discord event to listen for.
	 * @arg {Function} handle - Function to execute when the event is emitted.
	 * @arg {boolean} once - `true` to only ever listen for the first emission of the event.
	 */
	constructor(name, handle, once = false) {
		this.name = name;
		this.handle = handle;
		this.once = once;
	}
}
exports.BotEvent = BotEvent;
