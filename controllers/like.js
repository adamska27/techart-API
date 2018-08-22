const express = require('express'),
	Like = require('../models/like');

module.exports = express.Router().get('/review/:reviewId', async (req, res) => {
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
});
