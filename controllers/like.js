const express = require('express'),
	Like = require('../models/like');

const { checkToken } = require('../auth/jwt');

module.exports = express
	.Router()
	.get('/:reviewId', async (req, res) => {
		const { reviewId } = req.params;

		try {
			const likesCount = await Like.findAndCountAll({
				raw: true,
				where: {
					review_id: reviewId
				}
			}).then(result => result.count);
			res.status(200).send({ likesCount });
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	})
	.post('/:reviewId', checkToken, async (req, res) => {
		const { reviewId } = req.params;
		const { id } = req.user;

		try {
			await Like.create({
				review_id: reviewId,
				user_id: id
			});
			res.status(200).json({ success: true });
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	});
