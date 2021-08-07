if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const port = process.env.SERVER_PORT || 3000;
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
const routes = require('./routes');
require('express-async-errors');

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(routes);

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
