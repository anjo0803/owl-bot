/**
 * The console module contains functions for printing messages to the console in a standardized
 * format during the bot's execution.
 * @module msg
 */

/**
 * 
 */
const $ = require('./settings.json');

/**
 * Prints the given message to the console, using the given prefix.
 * @arg {boolean} isError - `true` to print the message as an error, otherwise `false`.
 * @arg {string} prefix - A prefix to insert between the time of printing and the actual message.
 * @arg {string} message - The message to output.
 */
function printTemplate(isError, prefix, message) {
	let func = isError ? console.error : console.log;
	func(`[${new Date().toLocaleTimeString('en')}] [${prefix}] ${message}`);
}

/**
 * Prints the given message to the console.
 * @arg {string} message - The message to print.
 */
exports.printInfo = message => printTemplate(false, 'MSG', message);

/**
 * Prints the given message to the console, if the bot is being run in debug mode.
 * @arg {string} message - The message to print.
 */
exports.printDebug = message => {
	if($.debug.enabled) printTemplate(false, 'DBG', message);
}

/**
 * Prints the given message to the console, marking it with a warning prefix.
 * @arg {string} message - The message to print.
 */
exports.printWarn = message => printTemplate(false, 'WRN', message);

/**
 * Prints the given message to the console, marking it as an error.
 * @arg {string} message - The message to print.
 */
exports.printError = message => printTemplate(true, 'ERR', message);
