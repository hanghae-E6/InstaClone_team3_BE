const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const { createToken } = require('../util/auth-jwtToken.util');
const env = process.env;

const validateToken = function (tokenValue) {
    try {
        const { userId } = jwt.verify(tokenValue, env.TOKEN_SECRET_KEY);
        return userId;
    } catch (error) {
        return false;
    }
};

module.exports = async (req, res, next) => {
    const accessToken = req.headers.accesstoken;
    const refreshToken = req.headers.refreshtoken;

    if (!accessToken || !refreshToken) {
        res.status(401).json({
            errorMessage: '로그인이 필요한 기능입니다.',
        });
        return;
    }

    const [accessTokenType, accessTokenValue] = (accessToken || '').split(' ');
    const [refreshTokenType, refreshTokenValue] = (refreshToken || '').split(
        ' '
    );

    try {
        const userId = validateToken(accessTokenValue);
        if (!userId) {
            console.log('일단 엑세스 토큰 만료!');
            if (!validateToken(refreshTokenValue)) {
                console.log('리프레쉬토큰도 만료!');
                throw 'Token이 만료되었습니다. 다시 로그인해주세요.';
            }
            const user = await Users.findOne({
                where: { token: refreshTokenValue },
            });
            if (!user) {
                throw 'RefreshToken이 조작되었습니다. 다시 로그인해주세요.';
            }
            const newAccessToken = createToken(user.dataValues.userId, '1h');
            console.log(`새로발급받은 액세스: ${newAccessToken}`);

            res.header({ accesstoken: `Bearer ${newAccessToken}` });

            res.locals.userId = user.dataValues.userId;
            return next();
        }
        res.locals.userId = userId;
        next();
    } catch (error) {
        if (error === 'Token이 만료되었습니다. 다시 로그인해주세요.') {
            res.status(419).json({
                errorMessage: 'Token이 만료되었습니다. 다시 로그인해주세요.',
            });
        } else if (error === '존재하지 않는 사용자입니다.') {
            res.status(404).json({
                errorMessage: '존재하지 않는 사용자입니다.',
            });
        } else if (
            error === 'RefreshToken이 조작되었습니다. 다시 로그인해주세요.'
        ) {
            res.status(404).json({
                errorMessage:
                    'RefreshToken이 조작되었습니다. 다시 로그인해주세요.',
            });
        } else {
            console.log(error);
            res.status(400).json({
                errorMessage: '로그인이 필요한 기능입니다.',
            });
        }
    }
};
