const UserService = require('../services/user.service');
const jwt = require('jsonwebtoken');

class UserController {
    userService = new UserService();

    //회원가입 API
    signUp = async (req, res) => {
        try {
            const { email, nickname, password } = req.body;
            await this.userService.signUp(email, nickname, password);

            res.status(201).json({ message: '회원가입에 성공하였습니다.' });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '회원가입에 실패하였습니다.',
            });
        }
    };

    //아이디/닉네임 통합 중복확인 API
    findDup = async (req, res) => {
        const query = req.query;
        try {
            const message = await this.userService.findDup(query);
            res.status(200).json({ message });
        } catch (error) {
            console.log(error);
            if (error === '이미 사용중인 이메일입니다.') {
                return res.status(412).json({
                    errorMessage: '이미 사용중인 이메일입니다.',
                });
            }
            if (error === '이미 사용중인 닉네임입니다.') {
                return res.status(412).json({
                    errorMessage: '이미 사용중인 닉네임입니다.',
                });
            }
            res.status(400).json({
                errorMessage: '중복확인에 실패하였습니다.',
            });
        }
    };

    //로그인 API
    logIn = async (req, res) => {
        try {
            const { email, password } = req.body;

            const { accessToken, refreshToken } = await this.userService.logIn(
                email,
                password
            );
            const { userId } = jwt.verify(
                accessToken,
                process.env.TOKEN_SECRET_KEY
            );

            res.status(201).json({ userId, accessToken, refreshToken });
        } catch (error) {
            console.log(error);
            if (error === '아이디 또는 패스워드가 일치하지 않습니다.') {
                return res
                    .status(412)
                    .json({
                        errorMessage:
                            '아이디 또는 패스워드가 일치하지 않습니다.',
                    });
            }
            res.status(400).json({
                errorMessage: '로그인에 실패하였습니다.',
            });
        }
    };
}

module.exports = UserController;
