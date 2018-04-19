const bcrypt = require('bcrypt');

// options
const SALTROUNDS = 10;

/**
 * hash the password
 * @param {string} plainPassword
 * @return {string} hashPassword
 */

exports.hashPassword = async plainPassword => {
	try {
		const hashedPassword = await bcrypt.hash(plainPassword, SALTROUNDS);
		return hashedPassword;
	} catch (err) {
		console.log('error during hash step: ', err);
	}
};

/**
 * compare the hashed password in the database to the password from the input
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @return {bool}
 */

exports.comparePassword = async (plainPassword, hashedPassword) => {
	try {
		const checkPassword = await bcrypt.compare(plainPassword, hashedPassword);
		return checkPassword;
	} catch (err) {
		console.log('error during compare password: ', err);
	}
};
