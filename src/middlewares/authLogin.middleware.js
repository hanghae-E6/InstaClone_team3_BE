const jwt = require('jsonwebtoken');
const env = process.env;

const validateToken = function (tokenValue) {
    try {
        jwt.verify(tokenValue, env.TOKEN_SECRET_KEY);
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = async (req, res, next) => {
    const accessToken = req.headers.accesstoken;
    console.log(`accessToken = ${accessToken}`);
    const [accessTokenType, accessTokenValue] = (accessToken || '').split(' ');

    try {
        if (accessToken && validateToken(accessTokenValue)) {
            throw '이미 로그인 되어있습니다.';
        }
        next();
    } catch (error) {
        if (error === '이미 로그인 되어있습니다.') {
            return res
                .status(401)
                .json({ errorMessage: '이미 로그인 되어있습니다.' });
        } else {
            res.status(400).json({ errorMessage: '로그인에 실패하였습니다.' });
        }
    }
};
