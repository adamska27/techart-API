const express = require('express'),
	User = require('../models/user'),
	asyncMiddleware = require('../utils/asyncMiddleware'),
	jwt = require('jsonwebtoken');

module.exports = express
	.Router()
	.post(
		'/register',
		asyncMiddleware(async (req, res, next) => {
			const {
				firstName,
				lastName,
				userName,
				profilePicture,
				email,
				password,
				gamerProfile
			} = req.body;

			if (!gamerProfile) {
				try {
					const user = await User.create({
						firstName,
						lastName,
						userName,
						profilePicture,
						email,
						password
					});
					res.status(200).send(user);
				} catch (err) {
					res.status(500).send(err);
				}
			}

			const {
				adventure,
				action,
				horror,
				sport,
				auto,
				shooter,
				str,
				platform,
				versus,
				rpg
			} = gamerProfile;

			try {
				const user = await User.create({
					firstName,
					lastName,
					userName,
					profilePicture,
					email,
					password,
					adventure,
					action,
					horror,
					sport,
					auto,
					shooter,
					str,
					platform,
					versus,
					rpg
				});
				res.status(200).send(user);
			} catch (err) {
				res.status(500).send(err);
			}
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
			const authorized = await user.validPassword(password);

			if (authorized) {
				const { id, userName } = user.dataValues;
				const token = jwt.sign(
					{ id, userName, email },
					process.env.JWT_SECRET,
					{
						expiresIn: '24h'
					}
				);
				res.json(token);
			} else {
				res.status(401).json({ error: 'invalid password' });
			}
		})
	);
