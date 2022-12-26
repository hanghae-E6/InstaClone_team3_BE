const { Op } = require('sequelize');
const { Users, Comments } = require('../models/');

class CommentsRepository {
    constructor() {
        this.usersModel = Users;
        this.commentsModel = Comments;
    }

    findComment = async (commentId) => {
        return await this.commentsModel.findOne({
            where: { commentId },
            include: {
                nested: true,
                model: this.usersModel,
                as: 'User',
                attributes: ['nickname'],
            },
            raw: true,
        });
    };

    // db에 새로운 댓글 생성을 위한 메서드
    createComment = async ({ postId, userId, comment }) => {
        // db에 새로운 댓글 저장
        return await this.commentsModel.create({
            postId,
            userId,
            comment,
        });
    };

    deleteComment = async (commentId, userId) => {
        return await this.commentsModel.destroy({
            where: {
                [Op.and]: [{ commentId }, { userId }],
            },
        });
    };
}

module.exports = CommentsRepository;
