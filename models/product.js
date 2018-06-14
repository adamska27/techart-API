const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const Product = sequelize.define(
	'product',
	{
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true
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
