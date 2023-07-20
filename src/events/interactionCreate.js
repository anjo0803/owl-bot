/**
 * @module events/interactionCreate
 */

const {
	Events,
	BaseInteraction,
	CommandInteraction
} = require('discord.js');

const { BotEvent } = require('../event');
const command = require('../command');
const msg = require('../msg');

/**
 * Evaluates the type of the given interaction to pass it on to the specialized handlers.
 * @arg {BaseInteraction} i - The received interaction.
 */
async function evaluateInteraction(i) {
	msg.printDebug(`Received interaction from ${i.user.tag}, handling...`)

	if(i instanceof CommandInteraction) command.handle(i);

	// If the interaction is not handled but needs a reply, send some generic excuse text
	else if(i.isRepliable()) {
		i.reply({
			content: 'Sorry, there was an internal error!',
			ephemeral: true
		});
		msg.printWarn(`An ${i.type} from ${i.user.tag} went unhandled!`);
	}
}

module.exports = new BotEvent(Events.InteractionCreate, evaluateInteraction);
