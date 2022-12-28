const { sequelize } = require('../models');

class FollowRepository {
    #followModel;
    constructor(FollowModel) {
        this.#followModel = FollowModel;
    }

    getFollowerList = async (userId) => {
        const query = `SELECT userId, nickname, profileImg 
        FROM Users 
        INNER JOIN (SELECT userIdFollower AS myFollowerUserId FROM Follows WHERE userIdFollowing =$userIdFollowing ) as followerData
        ON Users.userId = followerData.myFollowerUserId`;

        const data = await sequelize.query(query, {
            bind: { userIdFollowing: userId },
            type: sequelize.QueryTypes.SELECT,
        });
        return data;
    };
    getFollowingList = async (userId) => {
        const query = `SELECT userId, nickname, profileImg
        FROM Users 
        INNER JOIN (SELECT userIdFollowing AS myFollowingUserId FROM Follows WHERE userIdFollower =$userIdFollower ) as followingData
        ON Users.userId = followingData.myFollowingUserId`;

        const data = await sequelize.query(query, {
            bind: { userIdFollower: userId },
            type: sequelize.QueryTypes.SELECT,
        });
        return data;
    };

    findOneFollow = async (elseUserId, userId) => {
        return this.#followModel.findOne({
            where: { userIdFollowing: elseUserId, userIdFollower: userId },
        });
    };

    createFollow = async (elseUserId, userId) => {
        await this.#followModel.create({
            userIdFollowing: elseUserId,
            userIdFollower: userId,
        });
    };
    destroyFollow = async (elseUserId, userId) => {
        await this.#followModel.destroy({
            where: { userIdFollowing: elseUserId, userIdFollower: userId },
        });
    };
}

module.exports = FollowRepository;
