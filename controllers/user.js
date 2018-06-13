const express = require('express'),
	User = require('../models/user');

module.exports = express
	.Router()
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
	});
