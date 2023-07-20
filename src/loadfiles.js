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
 * @arg {string} dir - Name of the root directory from which to load files.
 * @arg {*} type - Class to check the exports from the files found against.
 * @return {object[]} An array of all exports that are an instance of the given class.
 */
module.exports = (dir, type) => {
	if(typeof type !== 'function') {
		msg.printWarn(`Cannot load source files for invalid class type: [${type}]`);
		return null;
	}
	if(typeof dir !== 'string') {
		msg.printWarn(`Cannot load ${type.name} files from invalid path: [${dir}]`);
		return null;
	}
	msg.printDebug(`Loading ${type.name} files from directory ${dir}`);

	let ret = [];

	// Loop over all files in the source folder with a .js file extension
	let dirAbsolute = path.join(__dirname, dir);
	let sourceFiles = fs.readdirSync(dirAbsolute).filter(f => f.endsWith('.js'));
	for(let file of sourceFiles) {
		// If a file exports a class of the specified type, add it to the returns list
		let fileExport = require(path.join(dirAbsolute, file));
		if(fileExport instanceof type) ret.push(fileExport);
	}

	msg.printDebug(`${type.name} files (× ${ret.length}) successfully loaded!`);
	return ret;
}
