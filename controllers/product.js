const express = require('express'),
	Product = require('../models/product');

module.exports = express
	.Router()
	.post('/:id', async (req, res) => {
		const { id } = req.params;
		const {
			artworks,
			developers,
			expansions,
			franchises,
			game_modes,
			genres,
			hypes,
			keywords,
			name,
			platforms,
			popularity,
			publishers,
			release_dates,
			screenshots,
			storyline,
			summary,
			themes,
			videos
		} = req.body;
		try {
			const result = await Product.create({
				artworks,
				developers,
				expansions,
				franchises,
				game_modes,
				genres,
				hypes,
				id,
				keywords,
				name,
				platforms,
				popularity,
				publishers,
				release_dates,
				screenshots,
				storyline,
				summary,
				themes,
				videos
			});
			res.status(200).send(result);
		} catch (err) {
			res.status(500).send(err);
		}
	})
	.get('/:id', async (req, res) => {
		const { id } = req.params;

		try {
			const product = await Product.findOne({
				raw: true,
				where: { id }
			});
			const result = [product];
			res.status('200').send(result);
		} catch (err) {
			console.log(err);
		}
	});
