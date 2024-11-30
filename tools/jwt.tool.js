const jwt = require("jsonwebtoken");

const jwtTool = {
	generate: function (data) {
		const secret = process.env.JWT_SECRET;
		const options = {
			algorithm: "HS512",
			expiresIn: "1h",
			audience: process.env.JWT_AUDIENCE,
			issuer: process.env.JWT_ISSUER,
		};

		return jwt.sign(data, secret, options);
	},

	read: function (token) {
		const secret = process.env.JWT_SECRET;
		const options = {
			audience: process.env.JWT_AUDIENCE,
			issuer: process.env.JWT_ISSUER,
		};

		try {
			return jwt.verify(token, secret, options);
		} catch {
			return null;
		}
	},
};

module.exports = jwtTool;
