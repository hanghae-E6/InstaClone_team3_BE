class PostRepository {
    #PostsModel;
    #UsersModel;
    #LikesModel;
    constructor(PostsModel, UsersModel, LikesModel) {
        this.#PostsModel = PostsModel;
        this.#UsersModel = UsersModel;
        this.#LikesModel = LikesModel;
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
