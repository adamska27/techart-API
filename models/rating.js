const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./product'),
	User = require('./user');

const Rating = sequelize.define(
	'rating',
	{
		story: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		feeling: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		levelDesign: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		artDesign: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		originality: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		soundDesign: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		textures: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		framerate: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		physics: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		lighting: {
			type: Sequelize.INTEGER,
			allowNull: false
		}
	},
	{
		hooks: {
			beforeCreate: async rating => {
				// check if product already exist
				const checkProduct = await Product.findOne({
					where: {
						id: rating.product_id
					}
				});
				if (!checkProduct) {
					try {
						await Product.create({
							id: rating.product_id
						});
					} catch (err) {
						console.log('err :', err);
					}
				}
			}
		}
	}
);

User.belongsToMany(Product, { through: Rating, foreignKey: 'user_id' });
Product.belongsToMany(User, { through: Rating, foreignKey: 'product_id' });

module.exports = Rating;
