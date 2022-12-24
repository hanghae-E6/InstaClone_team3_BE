class PostRepository {
    constructor(PostsModel, UsersModel, CommentsModel) {
        this.PostsModel = PostsModel;
        this.UsersModel = UsersModel;
        this.CommentsModel = CommentsModel;
    }

    createPost = async (userId, postImg, content) => {
        const createdPost = await this.PostsModel.create({
            userId,
            postImg,
            content,
        });
        return createdPost;
    };

    findAllPost = async () => {
        const posts = await this.PostsModel.findAll({
            include: [
                {
                    model: this.UsersModel,
                    attributes: ['nickname'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return posts;
    };

    findPostById = async (postId) => {
        const findPost = await this.PostsModel.findOne({
            where: { postId },
            include: [
                {
                    model: this.UsersModel,
                    attributes: ['nickname'],
                },
            ],
        });
        return findPost;
    };

    updatePost = async (userId, postId, postImg, content) => {
        return await this.PostsModel.update(
            {
                postImg,
                content,
            },
            { where: { userId, postId } }
        );
    };

    deletePost = async (userId, postId) => {
        return await this.PostsModel.destroy({
            where: { userId, postId },
        });
    };

    findPost = async (postId) => {
        const existPost = await this.PostsModel.findOne({
            where: { postId },
        });

        return existPost;
    };
}

module.exports = PostRepository;
