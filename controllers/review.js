const express = require('express'),
	Review = require('../models/Review'),
	Like = require('../models/Like'),
	sequelize = require('../config/db');

const { checkToken, checkTokenWithoutError } = require('../auth/jwt');

module.exports = express
	.Router()
	// create a review
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
	// get a specific review for game
	.get(
		'/review/:productId/:reviewId',
		checkTokenWithoutError,
		async (req, res) => {
			const { productId, reviewId } = req.params;
			const userId = req.user ? req.user.id : null;

			try {
				const result = await sequelize.query(
					`SELECT count(1) over () as likes_count, reviews.id as review_id, products.id as product_id, users.id as users_id, reviews.body, products.screenshots, products.name
					FROM reviews
					INNER JOIN products ON product_id = products.id
					LEFT JOIN likes ON reviews.id = likes.review_id
					LEFT JOIN users ON users.id = likes.user_id
					WHERE product_id = ${productId} AND reviews.id = ${reviewId}
					GROUP BY reviews.id, products.id, users.id
					;`,
					{ type: sequelize.QueryTypes.SELECT }
				);

				let review = result[0];

				// if the user is connected
				if (userId) {
					for (var i = 0; i < result.length; i = i + 1) {
						// check if the review is already like by the current user
						if (result[i].users_id === userId) {
							const reviewAndIsLiked = Object.assign(result[i], {
								isLiked: true
							});
							review = reviewAndIsLiked;
						}
					}
				}
				res.status(200).send(review);
			} catch (error) {
				res.status(500).json({ success: false, error });
			}
		}
	)
	// get all reviews for a game
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
	// get the 3 reviews with the most likes
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
	})
	// like a review
	.post('/like/:reviewId', checkToken, async (req, res) => {
		const { reviewId } = req.params;
		const { id } = req.user;

		// check if the review exist
		try {
			const review = await Review.findOne({
				raw: true,
				where: { id: reviewId }
			});

			// check if it is the current user review
			if (review.user_id === id) {
				res
					.status(500)
					.json({ success: false, message: 'A user can\'t like is own review' });
			}

			// check if the review is already liked
			const liked = await Like.findOne({
				raw: true,
				where: { review_id: reviewId, user_id: id }
			});

			if (liked && liked.user_id === id) {
				res.status(500).json({
					success: false,
					message: 'review already liked by the user',
					isLiked: true
				});
			}

			// like the review
			await Like.create({
				review_id: reviewId,
				user_id: id
			});
			res.status(200).json({ success: true, message: 'review liked' });
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	})
	// unlike a review
	.delete('/unlike/:reviewId', checkToken, async (req, res) => {
		const { reviewId } = req.params;
		const { id } = req.user;

		try {
			// check if like exists
			const like = await Like.findOne({
				raw: true,
				where: { review_id: reviewId, user_id: id }
			});

			if (like) {
				await Like.destroy({
					where: { review_id: reviewId, user_id: id }
				});
				res.status(200).json({ success: true, message: 'review unlike' });
			} else {
				res
					.status(404)
					.json({ success: false, message: 'like not found', isLiked: false });
			}
		} catch (error) {
			res.status(500).json({ success: false, error });
		}
	});
