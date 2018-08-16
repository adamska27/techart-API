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
		profilePicture: {
			type: Sequelize.STRING,
			defaultValue: 'https://cdn.filestackcontent.com/Nes1kLxSwC7YqVEBF1fR'
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
		},
		adventure: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		action: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		horror: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		sport: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		auto: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		shooter: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		str: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		platform: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		versus: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		rpg: {
			type: Sequelize.INTEGER,
			defaultValue: 1
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
