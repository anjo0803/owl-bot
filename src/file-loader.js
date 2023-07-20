/**
 * @module file-loader
 */

/**
 * 
 */

const fs = require('node:fs');
const path = require('node:path');

const msg = require('./msg');

/**
 * `require()`s all JavaScript files in the specified root directory (without checking sub-
 * directories) and checks whether they export an instance of a given class.
 * @arg {string} path - Name of the root directory from which to load files.
 * @arg {*} instance - Class to check the exports from the files found against.
 * @return {object[]} An array of all exports that are an instance of the given class.
 */
module.exports = (path, type) => {
	if(typeof instance !== 'object') {
		msg.printWarn(`Cannot load source files for invalid class type: [${type}]`);
		return null;
	}
	if(typeof path !== 'string') {
		msg.printWarn(`Cannot load ${type.constructor.name} files from invalid path: [${path}]`);
		return null;
	}
	msg.printDebug(`Loading ${type.constructor.name} files from directory ${path}`);

	let ret = [];

	// Loop over all files in the source folder with a .js file extension
	let pathAbsolute = path.join(__dirname, path);
	let sourceFiles = fs.readdirSync(pathAbsolute).filter(f => f.endsWith('.js'));
	for(let file of sourceFiles) {
		// If a file exports a class of the specified type, add it to the returns list
		let fileExport = require(file);
		if(fileExport instanceof type) ret.push(fileExport);
	}

	msg.printDebug(`${type.constructor.name} files (× ${ret.length}) successfully loaded!`);
	return ret;
}
