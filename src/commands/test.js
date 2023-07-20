/**
 * @module commands/test
 */

const {
	CommandInteraction,
	SlashCommandBuilder
} = require('discord.js');

const {
	BotCommand
} = require('../command');

/**
 * 
 * @arg {CommandInteraction} i - The interaction triggering command execution.
 */
async function runTest(i) {
	i.reply({
		content: 'Booyah!',
		ephemeral: true
	});
}

module.exports = new BotCommand(new SlashCommandBuilder()
	.setName('test')
	.setDescription('Run the test function.'),
	runTest
);
