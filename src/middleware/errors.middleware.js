const address = require('../helpers/addresser.helper');
const messageJson = require('../constants/http_message.helper');

exports.nullRoute = (req, res, next) => {
	return res.status(404).json(messageJson.status404);
};

exports.internalError = (err, req, res, next) => {
	//console.log(err.stack);
	const IP = address.getIP(req);
	console.log('Something broke, Client IP:', IP);
  if (err.response?.status) {
    return res.status(err.response.status).send({ error: err.response.statusText });
  }
  else if (err.status) {
    return res.status(err.status).send({ error: err.message });
  }

  if(err.message === 'CORS') {
    return res.status(403).json(messageJson.status403);
  }
  
	return res.status(500).json(messageJson.status500);
};
