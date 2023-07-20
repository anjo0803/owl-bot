/**
 * 
 * @module commands/command
 */

const {
	Client,
	Collection,
	CommandInteraction,
	SlashCommandBuilder,

	REST,
	Routes
} = require('discord.js');

const loadfiles = require('./loadfiles');
const msg = require('./msg');
const $ = require('./settings.json');

/**
 * Runs the appropriate command executor function for the given Slash Command interaction.
 * @param {CommandInteraction} i - The interaction where a user tries to run a Slash Command.
 */
exports.handle = (i) => {

	// Try to get the command executor function and run it if it exists
	let execute = COMMANDS.get(i.commandName);
	if(typeof execute !== 'function') {
		i.reply({
			content: 'Sorry, there was an internal error.',
			ephemeral: true
		});
		msg.printWarn(`User ${i.user.tag} ran unhandled command ${i.commandName}!`);
	} else execute(i).then(
		() => msg.printDebug(`Command ${i.commandName} executed for ${i.user.tag}`),
		(e) => {
			msg.printError(`Could not execute command ${i.commandName} for ${i.user.tag}: ${e}`);
			console.error(e);
		}
	);
}

/**
 * Names and executor functions of all Slash Commands registered for the bot as key-value pairs.
 * @type Collection<string, CommandExecutor>
 */
const COMMANDS = new Collection();

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
 * @enum
 */
const COMMAND_PERMS = Object.freeze({
	OWNER: 1,
	AUTHORIZE: 2,
	VOTES: 4,
	RECOS: 8
});

/**
 * 
 * @callback CommandExecutor
 * @arg {CommandInteraction} interaction - The Discord Interaction triggering command execution.
 * @return {Promise<void>}
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
	 * @virtual
	 */
	async execute() {
		throw new Error('Command has no handler attached!');
	}
}
exports.BotCommand = BotCommand;
