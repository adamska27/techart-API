const jwt = require('jsonwebtoken');
const User = require('../models/user');

const extractBearerToken = headerValue => {
	if (typeof headerValue !== 'string') {
		return false;
	}
	const matches = headerValue.match(/(bearer)\s+(\S+)/i);
	return matches && matches[2];
};

exports.checkToken = (req, res, next) => {
	const token =
		req.headers.authorization && extractBearerToken(req.headers.authorization);

	if (!token) res.status('403').json({ error: 'no token' });

	jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
		if (err) res.status('403').json({ error: 'bad token' });
		const { id } = decodedToken;

		User.findById(id)
			.then(user => {
				if (!user) res.status('403').json({ error: 'Bad user' });
				req.user = user;
				next();
			})
			.catch(err => res.json(err));
	});
};
