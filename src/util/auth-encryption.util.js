require('dotenv').config();
const env = process.env;
const { createHmac } = require('crypto');

const hash = (password) => {
    return createHmac('sha256', env.CRYPTO_SECRET_KEY)
        .update(password)
        .digest('hex');
};

module.exports = hash;
