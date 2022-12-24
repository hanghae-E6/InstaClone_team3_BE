const { Op } = require('sequelize');

class UserRepository {
    #userModel;
    constructor(UserModel) {
        this.#userModel = UserModel;
    }

    createUser = async (email, nickname, password) => {
        const createUser = await this.#userModel.create({
            email,
            nickname,
            password,
        });
        return createUser;
    };

    findOneUserByEmail = async (email) => {
        return await this.#userModel.findOne({
            where: { email },
            attributes: { exclude: ['password'] },
        });
    };
    findOneUserByNickname = async (nickname) => {
        return await this.#userModel.findOne({
            where: { nickname },
            attributes: { exclude: ['password'] },
        });
    };
    findUserByAuth = async (email, password) => {
        const findUser = await this.#userModel.findOne({
            where: { [Op.and]: [{ email }, { password }] },
            attributes: { exclude: ['password'] },
        });
        return findUser;
    };
    updateRefreshToken = async (token, email) => {
        await this.#userModel.update({ token }, { where: { email: email } });
    };
}

module.exports = UserRepository;
