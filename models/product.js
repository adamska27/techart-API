const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const Product = sequelize.define(
	'product',
	{
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: true
		},
		summary: {
			type: Sequelize.TEXT
		},
		screenshots: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		cover: {
			type: Sequelize.JSON
		},
		storyline: {
			type: Sequelize.TEXT
		},
		release_dates: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		hypes: {
			type: Sequelize.INTEGER
		},
		popularity: {
			type: Sequelize.DOUBLE
		},
		genres: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		franchises: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		game_modes: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		developers: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		keywords: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		themes: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		platforms: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		expansions: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		artworks: {
			type: Sequelize.JSON
		},
		videos: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		},
		publishers: {
			type: Sequelize.ARRAY(Sequelize.JSON)
		}
	},
	{
		hooks: {
			beforeCreate: async product => {
				// check if product already exist
				const checkProduct = await Product.findOne({
					where: {
						id: product.id
					}
				});
				if (checkProduct) {
					throw new Error('The product already exists');
				}
			}
		}
	}
);

module.exports = Product;
