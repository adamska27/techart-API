const express = require('express');
const app = express();
const port = 3005;

app.listen(port, () => {
	console.log(`the app is listening on the port ${port}`);
});
