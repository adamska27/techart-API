const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./product');

const Rating = sequelize.define(
	'rating',
	{
		user_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		product_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
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
				const checkProductAndUser = await Rating.findAll({
					attributes: ['user_id', 'product_id'],
					where: {
						product_id: rating.product_id,
						user_id: rating.user_id
					}
				});

				if (!checkProductAndUser.length) {
					try {
						await Product.create({
							id: rating.product_id
						});
					} catch (err) {
						throw new Error('error during product creation');
					}
				} else {
					throw new Error('Error already voted!');
				}
			}
		}
	}
);

module.exports = Rating;
