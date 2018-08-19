const express = require('express'),
	Rating = require('../models/rating'),
	sequelize = require('../config/db');

const { checkToken } = require('../auth/jwt');

module.exports = express
	.Router()
	.post('/:productId', checkToken, async (req, res) => {
		const { productId } = req.params;
		const { ratings } = req.body;

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
		} = ratings;

		try {
			await Rating.create({
				user_id: req.user.id,
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
			res.status(200).json({ success: true, message: 'ratings added' });
		} catch (err) {
			res.status(500).json({ success: false, err });
		}
	})
	.get('/:productId', checkToken, async (req, res) => {
		const { productId } = req.params;
		try {
			const response = await Rating.findAll({
				raw: true,
				where: {
					user_id: req.user.id,
					product_id: productId
				}
			});
			const noResponse = [];
			if (response.length) {
				const values = Object.values(response[0]);
				values.length = 10;
				res.status(200).send(values);
			} else {
				res.status(200).send(noResponse);
			}
		} catch (err) {
			res.status(500).send(err);
		}
	})
	.get('/average/:productId', async (req, res) => {
		const { productId } = req.params;
		try {
			const response = await Rating.findAll({
				raw: true,
				attributes: [
					[sequelize.fn('AVG', sequelize.col('story')), 'total_story'],
					[sequelize.fn('AVG', sequelize.col('feeling')), 'total_feeling'],
					[
						sequelize.fn('AVG', sequelize.col('levelDesign')),
						'total_levelDesign'
					],
					[sequelize.fn('AVG', sequelize.col('artDesign')), 'total_artDesign'],
					[
						sequelize.fn('AVG', sequelize.col('originality')),
						'total_originality'
					],
					[
						sequelize.fn('AVG', sequelize.col('soundDesign')),
						'total_soundDesign'
					],
					[sequelize.fn('AVG', sequelize.col('textures')), 'total_textures'],
					[sequelize.fn('AVG', sequelize.col('framerate')), 'total_framerate'],
					[sequelize.fn('AVG', sequelize.col('physics')), 'total_physics'],
					[sequelize.fn('AVG', sequelize.col('lighting')), 'total_lighting']
				],
				where: {
					product_id: productId
				}
			});
			const noResponse = [];
			if (response.length) {
				const values = Object.values(response[0]);
				const formatedValues = values.map(x => Number(x).toFixed(1));
				console.log({ formatedValues });
				res.status(200).send(formatedValues);
			} else {
				res.status(200).send(noResponse);
			}
		} catch (err) {
			res.status('500').send(err);
		}
	});
