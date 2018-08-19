const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Review = require('./review'),
	User = require('./user');

const Like = sequelize.define('like', {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	}
});

User.belongsToMany(Review, { through: Like, foreignKey: 'user_id' });
Review.belongsToMany(User, { through: Like, foreignKey: 'review_id' });

module.exports = Like;
