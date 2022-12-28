const UserRepository = require('../repositories/user.repository');
const FollowRepository = require('../repositories/follow.repository');
const { Users, Follows } = require('../models');
require('dotenv').config();
const hash = require('../util/auth-encryption.util.js');
const { createToken } = require('../util/auth-jwtToken.util.js');

class UserService {
    userRepository = new UserRepository(Users);
    followRepository = new FollowRepository(Follows);

    //회원가입 API
    signUp = async (email, nickname, password, profileImg) => {
        const hashValue = hash(password);
        const user = await this.userRepository.createUser(
            email,
            nickname,
            hashValue,
            profileImg
        );
        return user;
    };

    //아이디/닉네임 중복확인 API
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

    //로그인 API
    logIn = async (email, password) => {
        const hashValue = hash(password);
        const user = await this.userRepository.findUserByAuth(email, hashValue);

        if (!user) {
            throw '아이디 또는 패스워드가 일치하지 않습니다.';
        }

        const accessToken = createToken(user.userId, '1h');
        const refreshToken = createToken('refreshToken', '1d');
        await this.userRepository.updateRefreshToken(refreshToken, email);

        return { accessToken, refreshToken };
    };

    findOneUser = async (userId) => {
        const user = await this.userRepository.findOneUser(userId);
        if (!user) throw '존재하지 않는 사용자입니다.';

        const followingCounts = await this.followRepository.getFollowingList(
            userId
        );
        const followerCounts = await this.followRepository.getFollowerList(
            userId
        );

        return {
            userId: user.userId,
            email: user.email,
            nickname: user.nickname,
            profileImg: user.profileImg,
            following: followingCounts.length,
            follower: followerCounts.length,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    };

    updateUser = async (userId, nickname, tokenUserId, profileImg) => {
        const user = await this.userRepository.findOneUser(userId);
        if (!user) throw new Error('존재하지않는 사용자입니다.');
        if (user.userId !== tokenUserId) throw new Error('권한이 없습니다.');
        await this.userRepository.updatePost(userId, nickname, profileImg);
    };
}

module.exports = UserService;
