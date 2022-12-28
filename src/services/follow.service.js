const { Follows, Users, sequelize } = require('../models');
const UserRepository = require('../repositories/user.repository.js');
const FollowRepository = require('../repositories/follow.repository.js');

class FollowService {
    userRepository = new UserRepository(Users);
    followRepository = new FollowRepository(Follows);

    getFollowList = async (userId) => {
        const checkUserId = await this.userRepository.findOneUser(userId);
        if (!checkUserId) throw '존재하지 않는 사용자입니다.';

        const myFollowerList = await this.followRepository.getFollowerList(
            userId
        );
        const myFollowingList = await this.followRepository.getFollowingList(
            userId
        );

        return {
            following: myFollowingList,
            follower: myFollowerList,
        };
    };

    followListEdit = async (userId, elseUserId) => {
        const checkUserId = await this.userRepository.findOneUser(elseUserId);
        if (!checkUserId) throw '존재하지 않는 사용자입니다.';

        if (userId === elseUserId) throw '자기 자신은 팔로우를 하지 못합니다.';

        const checkFollow = await this.followRepository.findOneFollow(
            elseUserId,
            userId
        );

        if (!checkFollow) {
            await this.followRepository.createFollow(elseUserId, userId);
        } else {
            await this.followRepository.destroyFollow(elseUserId, userId);
        }
    };
}

module.exports = FollowService;
