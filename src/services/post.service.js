const PostRepository = require('../repositories/post.repository');
const { ValidationError } = require('../middleWares/exceptions/error.class');
const { Users, Posts, Comments, Likes } = require('../models');

class PostService {
    postRepository = new PostRepository(Posts, Users, Comments, Likes);

    createPost = async (userId, postImg, content) => {
        const createdPost = await this.postRepository.createPost(
            userId,
            postImg,
            content
        );
        if (!createdPost)
            throw ValidationError('게시글 작성에 실패하였습니다.', 400);
        return createdPost;
    };

    findAllPost = async () => {
        const posts = await this.postRepository.findAllPost();
        if (!posts) {
            throw ValidationError('게시글 조회에 실패하였습니다.', 400);
        }
        return posts.map((post) => {
            return {
                postId: post.postId,
                userId: post.userId,
                title: post.title,
                postImg: post.postImg,
                content: post.content,
                nickname: post.User.nickname,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });
    };

    findPostById = async (postId) => {
        const findPost = await this.postRepository.findPostById(postId);

        if (!findPost)
            throw new ValidationError('존재하지 않는 게시글입니다.', 404);
        return {
            postId: findPost.postId,
            userId: findPost.userId,
            postImg: findPost.postImg,
            content: findPost.content,
            nickname: findPost.User.nickname,
            createdAt: findPost.createdAt,
            updatedAt: findPost.updatedAt,
        };
    };

    updatePost = async (userId, postId, postImg, content) => {
        const findPost = await this.postRepository.findPostById(postId);
        if (!findPost) {
            throw new ValidationError('존재하지 않는 게시글입니다.', 404);
        }
        if (findPost.userId !== userId) {
            throw new ValidationError('권한이 없습니다.', 401);
        }
        await this.postRepository.updatePost(userId, postId, postImg, content);
    };

    deletePost = async (userId, postId) => {
        const findPost = await this.postRepository.findPostById(postId);
        if (!findPost) {
            throw new ValidationError('존재하지 않는 게시글입니다.', 404);
        }
        if (findPost.userId !== userId) {
            throw new ValidationError('권한이 없습니다.', 401);
        }
        await this.postRepository.deletePost(userId, postId);
    };
}

module.exports = PostService;
