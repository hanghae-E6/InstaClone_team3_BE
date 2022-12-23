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

    findDup = async (query) => {
        const prop = Object.keys(query)[0];
        const value = Object.values(query)[0];
        if (prop === 'email') {
            const user = await this.userRepository.findOneUserByEmail(value);
            if (user) {
                throw '이미 사용중인 이메일입니다.';
            } else {
                return '이메일 중복확인에 성공하였습니다.';
            }
        } else if (prop === 'nickname') {
            const user = await this.userRepository.findOneUserByNickname(value);
            if (user) {
                throw '이미 사용중인 닉네임입니다.';
            } else {
                return '닉네임 중복확인에 성공하였습니다.';
            }
        } else {
            throw 'Service findDup Error';
        }
    };
}

module.exports = UserService;
