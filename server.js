if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const port = process.env.PORT || process.env.SERVER_PORT || 3000;
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();
const routes = require('./routes');
const db = require('./src/utils/db');
require('express-async-errors');

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json());

app.use(routes);

db
	.sync()
	.then(() => {
		app.listen(port, () => {
			console.log(`Server is listening on port ${port}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
