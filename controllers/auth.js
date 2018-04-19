const express = require('express'),
	User = require('../models/user'),
	asyncMiddleware = require('../utils/asyncMiddleware'),
	jwt = require('jsonwebtoken');

module.exports = express
	.Router()
	.post(
		'/register',
		asyncMiddleware(async (req, res, next) => {
			const { firstName, lastName, userName, email, password } = req.body;

			const user = await User.create({
				firstName,
				lastName,
				userName,
				email,
				password
			});

			res.status(200).send('user created');
		})
	)
	.post(
		'/login',
		asyncMiddleware(async (req, res, next) => {
			const { email, password } = req.body;
			// find the user by email
			const user = await User.findOne({ where: { email } });
			// throw an error if the email is not found
			if (!user) res.status(401).json({ error: 'email not found' });
			// verify the password entered with the password hashed in database
			const passwordCheck = await user.validPassword(password);
			const { id, username } = user.dataValues;

			if (passwordCheck) {
				const token = jwt.sign({ id, username, email }, 'secret', {
					expiresIn: '3h'
				});
				res.json(token);
			}
		})
	);
