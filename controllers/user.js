const express = require('express'),
	User = require('../models/user'),
	sequelize = require('../config/db');

const { checkToken } = require('../auth/jwt');

module.exports = express
	.Router()
	.get('/profile', checkToken, async (req, res) => {
		const { id } = req.user;
		try {
			const result = await User.findById(id, {
				attributes: [
					'firstName',
					'lastName',
					'userName',
					'profilePicture',
					'email'
				],
				raw: true
			});
			res.status(200).send(result);
		} catch (error) {
			res.status(500).json({ error });
		}
	})
	.get('/all', async (req, res) => {
		try {
			const users = await User.findAll({
				attributes: ['id', 'userName'],
				limit: 1,
				order: [['createdAt', 'DESC']]
			});
			res.status(200).send(users);
		} catch (err) {
			res.status(500).send(err);
		}
	})
	.get('/latest', async (req, res) => {
		try {
			const latestUsers = await User.findAll({
				attributes: ['id', 'userName'],
				limit: 3,
				order: [['createdAt', 'DESC']]
			});
			res.status(200).send(latestUsers);
		} catch (err) {
			res.status(500).send(err);
		}
	})
	.get('/collection', checkToken, async (req, res) => {
		try {
			const { id } = req.user;
			const collection = await sequelize
				.query(
					`SELECT products.name, products.artworks
					FROM ratings
					INNER JOIN products 
					ON product_id = products.id
					WHERE ratings.user_id = ${id};`,
					{ type: sequelize.QueryTypes.SELECT }
				)
				.then(collection => collection);
			res.status(200).send(collection);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	});
