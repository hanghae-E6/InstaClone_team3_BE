const UserRepository = require('../repositories/user.repository');
const { Users } = require('../models');
require('dotenv').config();
const hash = require('../util/auth-encryption.util.js');

class UserService {
    userRepository = new UserRepository(Users);

    signUp = async (email, nickname, password) => {
        const hashValue = hash(password);
        const user = await this.userRepository.createUser(
            email,
            nickname,
            hashValue
        );
        return user;
    };
}

module.exports = UserService;
