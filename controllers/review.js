const express = require('express'),
	Review = require('../models/Review'),
	Sequelize = require('sequelize'),
	sequelize = require('../config/db');

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
	.get('/review/:productId/:reviewId', async (req, res) => {
		const { productId, reviewId } = req.params;

		try {
			const result = await sequelize.query(
				`SELECT count(likes.review_id) as likes_count, reviews.id, products.id, reviews.body, products.screenshots, products.name
				FROM reviews
				INNER JOIN products ON product_id = products.id
				LEFT JOIN likes ON reviews.id = likes.review_id
				WHERE product_id = ${productId} AND reviews.id = ${reviewId}
				GROUP BY reviews.id, products.id
				;`,
				{ type: sequelize.QueryTypes.SELECT }
			);
			res.status(200).send(result);
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	})
	.get('/product/:productId', async (req, res) => {
		const { productId } = req.params;
		try {
			const result = await sequelize.query(
				`SELECT reviews.id,reviews.product_id, reviews.user_id, count(likes.review_id) as likes_count, cover, body, users."profilePicture", users."userName", reviews."createdAt"
				FROM reviews
				LEFT JOIN likes ON reviews.id = likes.review_id
				INNER JOIN users ON reviews.user_id = users.id
				INNER JOIN products ON reviews.product_id = products.id
				WHERE products.id = ${productId}
				GROUP BY reviews.id, products.id, users.id
				ORDER BY reviews."createdAt" DESC
				;`,
				{ type: sequelize.QueryTypes.SELECT }
			);
			res.status(200).send(result);
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	})
	.put('/likes/:reviewId', checkToken, async (req, res) => {
		const { id } = req.user;
		const { reviewId } = req.params;
		try {
			Review.update(
				{ likes: Sequelize.literal('likes + 1') },
				{ where: { id: reviewId } }
			);
			res.status(200).json({ success: true });
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	})
	.get('/best', async (req, res) => {
		try {
			const reviewsOfTheWeek = await sequelize.query(
				`SELECT reviews.id,reviews.product_id, reviews.user_id, count(likes.review_id) as likes_count, cover, body, users."profilePicture", users."userName"
        FROM reviews
        INNER JOIN likes ON reviews.id = likes.review_id
        INNER JOIN users ON reviews.user_id = users.id
        INNER JOIN products ON reviews.product_id = products.id
        GROUP BY reviews.id, products.id, users.id
        ORDER BY likes_count DESC
        LIMIT 3
        ;`,
				{ type: sequelize.QueryTypes.SELECT }
			);
			res.status(200).send(reviewsOfTheWeek);
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	});
