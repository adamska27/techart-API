const express = require('express'),
	Review = require('../models/Review');

const { checkToken } = require('../auth/jwt');

module.exports = express
	.Router()
	.post('/:productId', checkToken, async (req, res) => {
		const { productId } = req.params;
		const { id } = req.user;
		const { review } = req.body;

		try {
			await Review.create({
				user_id: id,
				product_id: productId,
				body: review
			});
			res.status(200).json({ success: true, message: 'review created' });
		} catch (error) {
			res.status(500).json({ succes: false, error });
		}
	})
	.get('/:reviewId', async (req, res) => {
		const { reviewId } = req.params;

		try {
			const result = await Review.findOne({
				attributes: ['id', 'body'],
				raw: true,
				where: { id: reviewId }
			});
			res.status(200).send(result);
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	})
	.get('/product/:productId', async (req, res) => {
		const { productId } = req.params;
		try {
			const result = await Review.findAll({
				attributes: ['id', 'body'],
				where: {
					product_id: productId
				}
			});
			res.status(200).send(result);
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	});
