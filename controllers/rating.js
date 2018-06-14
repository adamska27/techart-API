const express = require('express'),
	Rating = require('../models/rating');

module.exports = express
	.Router()
	.post('/:userId/:productId', async (req, res) => {
		const { userId, productId } = req.params;
		const {
			story,
			feeling,
			levelDesign,
			artDesign,
			originality,
			soundDesign,
			textures,
			framerate,
			physics,
			lighting
		} = req.body;

		try {
			await Rating.create({
				user_id: userId,
				product_id: productId,
				story,
				feeling,
				levelDesign,
				artDesign,
				originality,
				soundDesign,
				textures,
				framerate,
				physics,
				lighting
			});
			res.status(200).send('rating created');
		} catch (err) {
			res.status(500).send(err);
		}
	});
