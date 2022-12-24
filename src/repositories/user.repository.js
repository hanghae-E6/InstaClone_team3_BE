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
}

module.exports = UserRepository;
