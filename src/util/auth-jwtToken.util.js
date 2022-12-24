const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;

function createToken(id, duration) {
    return jwt.sign({ userId: id }, env.TOKEN_SECRET_KEY, {
        expiresIn: duration,
    });
}

module.exports = { createToken };
