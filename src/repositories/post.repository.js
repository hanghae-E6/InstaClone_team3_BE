const { Op } = require('sequelize');

class PostRepository {
    #PostsModel;
    #UsersModel;
    #LikesModel;
    #CommentsModel;
    constructor(PostsModel, UsersModel, LikesModel, CommentsModel) {
        this.#PostsModel = PostsModel;
        this.#UsersModel = UsersModel;
        this.#LikesModel = LikesModel;
        this.#CommentsModel = CommentsModel;
    }

    createPost = async (userId, postImg, content) => {
        const createdPost = await this.#PostsModel.create({
            userId,
            postImg,
            content,
        });
        return createdPost;
    };

    findAllPost = async () => {
        const posts = await this.#PostsModel.findAll({
            include: [
                {
                    model: this.#UsersModel,
                    attributes: ['nickname'],
                },
                {
                    model: this.#LikesModel,
                    as: 'Likes',
                    attributes: ['likeId'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return posts;
    };

    findPostById = async (postId) => {
        const findPost = await this.#PostsModel.findOne({
            where: { postId },
            include: [
                {
                    model: this.#UsersModel,
                    attributes: ['nickname'],
                },
                {
                    model: this.#LikesModel,
                    as: 'Likes',
                    attributes: ['likeId'],
                },
            ],
        });
        return findPost;
    };

    findUserPosts = async (userId) => {
        return this.#PostsModel.findAll({
            where: { userId },
            include: [
                {
                    model: this.#UsersModel,
                    attributes: ['nickname'],
                },
            ],
        });
    };
    findAllCommentById = async (postId) => {
        const comments = await this.#CommentsModel.findAll({
            where: { postId },
            include: [
                {
                    model: this.#UsersModel,
                    attributes: ['nickname'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return comments;
    };

    getPostsByPage = async (pageNo) => {
        const posts = await this.#PostsModel.findAll({
            offset: pageNo,
            limit: 5,
            include: [
                {
                    model: this.#UsersModel,
                    attributes: ['nickname'],
                },
                {
                    model: this.#LikesModel,
                    as: 'Likes',
                    attributes: ['likeId'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        if (posts.length === 0) {
            return false;
        } else {
            return posts;
        }
    };

    updatePost = async (userId, postId, postImg, content) => {
        return await this.#PostsModel.update(
            {
                postImg,
                content,
            },
            { where: { userId, postId } }
        );
    };

    deletePost = async (userId, postId) => {
        return await this.#PostsModel.destroy({
            where: { userId, postId },
        });
    };
}

module.exports = PostRepository;
