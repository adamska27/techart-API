const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 3005;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/auth', require('./controllers/auth'));

app.all('*', (req, res) => res.status(404).send('Je suis la 404'));

app.listen(port, () => {
	console.log(`the app is listening on the port ${port}`);
});
