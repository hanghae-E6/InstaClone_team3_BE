const UserService = require('../services/user.service');
const jwt = require('jsonwebtoken');

class UserController {
    userService = new UserService();

    //회원가입 API
    signUp = async (req, res) => {
        try {
            const { email, nickname, password } = req.body;

            let profileImg = undefined;
            if (req.file) {
                profileImg = req.file.location;
            } else {
                profileImg =
                    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }

            await this.userService.signUp(
                email,
                nickname,
                password,
                profileImg
            );

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
            console.log(`accessToken = ${accessToken}`);

            res.header({
                accesstoken: `Bearer ${accessToken}`,
                refreshtoken: `Bearer ${refreshToken}`,
            });
            res.status(200).json({
                userId: userId,
            });
        } catch (error) {
            console.log(error);
            if (error === '아이디 또는 패스워드가 일치하지 않습니다.') {
                return res.status(412).json({
                    errorMessage: '아이디 또는 패스워드가 일치하지 않습니다.',
                });
            }
            res.status(400).json({
                errorMessage: '로그인에 실패하였습니다.',
            });
        }
    };

    findOneUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await this.userService.findOneUser(userId);
            res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            if (error === '존재하지 않는 사용자입니다.') {
                res.status(404).json({
                    errorMessage: '존재하지 않는 사용자입니다.',
                });
            }
            res.status(400).json({
                errorMessage: '사용자 정보 불러오기에 실패하였습니다.',
            });
        }
    };

    updateUser = async (req, res) => {
        try {
            const { userId } = req.params;

            const tokenUserId = res.locals.userId;
            console.log(tokenUserId);
            const { nickname } = req.body;
            let profileImg = undefined;

            if (req.file) {
                profileImg = req.file.location;
            } else if (req.body.profileImg === 'null') {
                profileImg =
                    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }

            await this.userService.updateUser(
                userId,
                nickname,
                tokenUserId,
                profileImg
            );
            return res
                .status(201)
                .json({ message: '사용자 정보가 수정되었습니다.' });
        } catch (error) {
            console.log(error);
            if (error.message === '존재하지않는 사용자입니다.') {
                return res
                    .status(404)
                    .json({ errorMessage: '존재하지않는 사용자입니다.' });
            }
            if (error.message === '권한이 없습니다.') {
                return res
                    .status(401)
                    .json({ errorMessage: '권한이 없습니다.' });
            }
            res.status(400).json({
                errorMessage: '사용자 정보 수정에 실패하였습니다.',
            });
        }
    };
}

module.exports = UserController;
