const myJWT = require('../helpers/jwt.helper');
const httpMessage = require('../constants/http_message.helper');

module.exports.authJWT = () => {
	return (req, res, next) => {
		const accessToken = myJWT.getAccessTokenFromHeader(req);
		// console.log(req.headers);
		if (accessToken) {
			const decoded = myJWT.verifyAccessToken(accessToken);
			if (decoded) {
				return next();
			} else {
				return res.status(401).json(httpMessage.status401_access_token);
			}
		}
		return res.status(401).json(httpMessage.status401_access_token);
	};
};
