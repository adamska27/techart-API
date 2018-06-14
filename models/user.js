const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const { hashPassword } = require('../auth/pwd');
const { comparePassword } = require('../auth/pwd');

const User = sequelize.define(
	'user',
	{
		firstName: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isAlpha: true
			}
		},
		lastName: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isAlpha: true
			}
		},
		userName: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		}
	},
	{
		hooks: {
			beforeCreate: async (user, options) => {
				// first check if user already exists
				const checkEmail = await User.findOne({ where: { email: user.email } });
				if (!checkEmail) {
					const hashedPassword = await hashPassword(user.password);
					user.password = hashedPassword;
				} else {
					console.log('user already exists');
				}
			}
		}
	}
);

//Model.instances
User.prototype.validPassword = function(plainPassword) {
	return comparePassword(plainPassword, this.password);
};

module.exports = User;
