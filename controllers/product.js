const express = require('express'),
	Product = require('../models/product');

module.exports = express.Router().post('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await Product.create({
			id
		});
		res.status(200).send('product created');
	} catch (err) {
		res.status(500).send(err);
	}
});
