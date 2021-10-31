const myJWT = require('../helpers/jwt.helper');
const httpMessage = require('../constants/http_message.constant');

module.exports.authJWT = () => {
	return (req, res, next) => {
		const token = myJWT.getAccessTokenFromHeader(req);
		// console.log(req.headers);
		if (token) {
			const decoded = myJWT.verifyAccessToken(token);
			if (decoded) {
				return next();
			} else {
				return res.status(401).json(httpMessage.status401_access_token);
			}
		}
		return res.status(401).json(httpMessage.status401_access_token);
	};
};

module.exports.seller = () => {
	return (req, res, next) => {
		const token = myJWT.getAccessTokenFromHeader(req);

		if (token) {
			const decoded = myJWT.verifyAccessToken(token);
			if (decoded) {
				if (decoded.role === 'seller' || decoded.role === 'admin') {
					return next();
				} else {
					return res.status(403).json(httpMessage.status403);
				}
			} else {
				return res.status(401).json(httpMessage.status401_access_token);
			}
		}
		return res.status(401).json(httpMessage.status401_access_token);
	};
};

module.exports.admin = () => {
	return (req, res, next) => {
		const token = myJWT.getAccessTokenFromHeader(req);

		if (token) {
			const decoded = myJWT.verifyAccessToken(token);
			if (decoded) {
				if (decoded.role === 'admin') {
					return next();
				} else {
					return res.status(403).json(httpMessage.status403);
				}
			} else {
				return res.status(401).json(httpMessage.status401_access_token);
			}
		}
		return res.status(401).json(httpMessage.status401_access_token);
	};
};
