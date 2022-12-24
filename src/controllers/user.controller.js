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
}

module.exports = UserController;
