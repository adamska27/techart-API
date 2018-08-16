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
					'id',
					'firstName',
					'lastName',
					'userName',
					'profilePicture',
					'email',
					'adventure',
					'action',
					'horror',
					'sport',
					'auto',
					'shooter',
					'str',
					'platform',
					'versus',
					'rpg'
				],
				raw: true
			});
			res.status(200).send(result);
		} catch (error) {
			res.status(500).json({ error });
		}
	})
	.get('/profile/:userId', async (req, res) => {
		const { userId } = req.params;
		try {
			const result = await User.findById(userId, {
				attributes: [
					'id',
					'firstName',
					'lastName',
					'userName',
					'profilePicture',
					'email',
					'adventure',
					'action',
					'horror',
					'sport',
					'auto',
					'shooter',
					'str',
					'platform',
					'versus',
					'rpg'
				],
				raw: true
			});
			res.status(200).send(result);
		} catch (error) {
			res.status(500).json({ error });
		}
	})
	.get('/best', async (req, res) => {
		try {
			const userOfTheWeek = await sequelize
				.query(
					`SELECT COUNT(user_id), users."id", users."userName", users."profilePicture"
				FROM ratings
				INNER JOIN users
				ON user_id = users.id
				WHERE 
				(ratings."createdAt" >= date_trunc('week', CURRENT_TIMESTAMP - interval '1 week')
				AND ratings."createdAt" < date_trunc('week', CURRENT_TIMESTAMP))
				GROUP BY users."id", users."userName", users."profilePicture"
				ORDER BY count DESC
				LIMIT 1
				;`,
					{ type: sequelize.QueryTypes.SELECT }
				)
				.then(userOfTheWeek => userOfTheWeek[0]);
			const result = userOfTheWeek ? userOfTheWeek : {};
			res.status(200).send(result);
		} catch (err) {
			res.status(500).send(err);
		}
	})
	.get('/latest', async (req, res) => {
		try {
			const latestUsers = await User.findAll({
				attributes: ['id', 'profilePicture', 'userName'],
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
					`SELECT products.id, products.name, products.artworks
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
