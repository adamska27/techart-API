const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./product'),
	User = require('./user');

const Review = sequelize.define('review', {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	body: {
		type: Sequelize.TEXT
	}
});

User.belongsToMany(Product, { through: Review, foreignKey: 'user_id' });
Product.belongsToMany(User, { through: Review, foreignKey: 'product_id' });

module.exports = Review;
