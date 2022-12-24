const { request } = require('express');
const UserService = require('../services/user.service');

class UserController {
    userService = new UserService();

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
}

module.exports = UserController;
