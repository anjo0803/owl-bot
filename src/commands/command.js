/**
 * 
 * @module commands/command
 */

const fs = require('node:fs');
const path = require('node:path');

const {
	Client,
	Collection,
	CommandInteraction,
	SlashCommandBuilder,

	REST,
	Routes
} = require('discord.js');

const loadfiles = require('../file-loader');
const msg = require('../msg');
const $ = require('../settings.json');

/**
 * Names and executor functions of all Slash Commands registered for the bot as key-value pairs.
 * @type Collection<string, CommandExecutor>
 */
const COMMANDS = new Collection();

/**
 * Gets the executor function of registered `BotCommand` by the given name.
 * @arg {string} name Name of the `BotCommand` whose executor function is desired.
 * @return {CommandExecutor | undefined} The execution function of the matching `BotCommand`.
 */
exports.getCommand = (name) => COMMANDS.get(name);

/**
 * Checks all JavaScript files in the commands folder for whether they export a
 * {@linkcode BotCommand}, and registers all recognized `BotCommand`s with Discord as Slash
 * Commands.
 * @arg {Client} client The discord.js `Client` of the bot.
 */
exports.registerSlashCommands = async () => {
	let commands = loadfiles('commands', BotCommand);

	// Get the JSON data of all commands for registration with Discord, and map them to their name
	// for later Interactions concurrently
	let json = [];
	for(let command of commands) {
		json.push(command.data.toJSON());
		COMMANDS.set(command.data.name, command.execute);
	}

	msg.printInfo('Updating BotCommands as with Discord as Slash Commands');

	let r = new REST();
	let promise;

	// For testing, Discord recommends updating Slash Commands for a dedicated test guild only
	if($.debug.enabled) promise = r.setToken(process.env.DEBUG_TOKEN).put(
		Routes.applicationGuildCommands($.debug.bot, $.debug.guild),
		{ body: json }
	)
	else promise = r.setToken(process.env.BOT_TOKEN).put(
		Routes.applicationCommands($.discord.bot),
		{ body: json }
	)

	promise.then(() => msg.printInfo('Slash Commands successfully updated!'), (e) => {
		msg.printError(`Failed to update Slash Commands: ${e}`);
		console.error(e);
	});
}

/**
 * 
 * @callback CommandExecutor
 * @arg {CommandInteraction} interaction - The Discord Interaction triggering command execution.
 */

/**
 * Represents a command users can run with the bot.
 */
class BotCommand {
	/**
	 * 
	 * @type SlashCommandBuilder
	 */
	data = null;

	/**
	 * Instantiates a new BotCommand with the given data and interaction handler.
	 * @arg {SlashCommandBuilder} data - The configured Slash Command data.
	 * @arg {CommandExecutor} execute - The function to run when the command is called.
	 */
	constructor(data, execute) {
		this.data = data;
		this.execute = execute;
	}

	/**
	 * The function that is executed when the command is called by a user.
	 * @arg {CommandInteraction} i The `Interaction` where the user calls the command.
	 * @return {boolean} `true` if executed successfully, `false` if there was an error.
	 * @virtual
	 */
	async execute(i) {
		await i.reply({
			ephemeral: true,
			content: 'Error: This command has not been properly implemented yet. :('
		});
		return false;
	}
}
exports.BotCommand = BotCommand;
