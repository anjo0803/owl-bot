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
	let commands = loadCommands();

	// Get the JSON data of all commands for registration with Discord, and map them to their name
	// for later Interactions concurrently
	let json = [];
	for(let command of commands) {
		json.push(command.data.toJSON());
		COMMANDS.set(command.data.name, command.execute);
	}

	msg.printInfo('Slash Commands are being registered...');

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

	promise.then(() => msg.printInfo('Slash Commands successfully registered!'), (e) => {
		msg.printError(`Failed to register Slash Commands: ${e}`);
		console.error(e);
	});
}

/**
 * Loads all `BotCommand`s declared by files in the `commands` folder.
 * @return {BotCommand[]} A list of all commands that were found.
 */
function loadCommands() {
	msg.printDebug('Loading Slash Command source files...')
	let ret = [];

	// Loop over all files in the commands folder with a .js file extension
	let commandsPath = path.join(__dirname, 'commands');
	let commandFilePaths = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
	for(let file of commandFilePaths) {

		// If the file in question exports a command, add it to the returns list
		let command = require(file);
		if(command instanceof BotCommand) ret.push(command);
	}

	msg.printDebug(`Slash Command source files (${ret.length}) successfully loaded!`);
	return ret;
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
