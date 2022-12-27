const PostRepository = require('../repositories/post.repository');
const {
    ValidationError,
    AuthenticationError,
} = require('../middlewares/exceptions/error.class');
const { Users, Posts, Likes, Comments } = require('../models');

class PostService {
    postRepository = new PostRepository(Posts, Users, Likes, Comments);
    userRepository = new UserRepository(Users);

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
        console.log(posts[10].User);
        return posts.map((post) => {
            return {
                postId: post.postId,
                userId: post.userId,
                title: post.title,
                postImg: post.postImg,
                content: post.content,
                nickname: post.User.nickname,
                likes: post.Likes.length,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });
    };

    findPostById = async (postId) => {
        const findPost = await this.postRepository.findPostById(postId);
        if (!findPost) {
            throw new ValidationError('존재하지 않는 게시글입니다.', 404);
        }

        return {
            postId: findPost.postId,
            userId: findPost.userId,
            postImg: findPost.postImg,
            content: findPost.content,
            nickname: findPost.User.nickname,
            likes: findPost.Likes.length,
            createdAt: findPost.createdAt,
            updatedAt: findPost.updatedAt,
        };
    };

    findUserPosts = async (userId) => {
        const user = await this.userRepository.findOneUser(userId);
        if (!user) throw '존재하지 않는 사용자입니다.';

        const posts = await this.postRepository.findUserPosts(userId);

        return posts;
    };

    findAllCommentById = async (postId) => {
        const findAllComment = await this.postRepository.findAllCommentById(
            postId
        );
        if (!findAllComment) {
            return null;
        } else {
            return findAllComment.map((comment) => {
                return {
                    nickname: comment.User.nickname,
                    comment: comment.comment,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                };
            });
        }
    };

    getPostsByPage = async (pageNo) => {
        let start = 0;

        if (pageNo <= 0) {
            pageNo = 1;
        } else {
            start = (pageNo - 1) * 5;
        }

        const posts = await this.postRepository.getPostsByPage(start);
        if (!posts) {
            throw new ValidationError('존재하지 않는 페이지입니다.', 404);
        }
        return posts.map((post) => {
            return {
                postId: post.postId,
                userId: post.userId,
                title: post.title,
                postImg: post.postImg,
                content: post.content,
                nickname: post.User.nickname,
                likes: post.Likes.length,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });
    };

    updatePost = async (userId, postId, postImg, content) => {
        const findPost = await this.postRepository.findPostById(postId);
        if (!findPost) {
            throw new ValidationError('존재하지 않는 게시글입니다.', 404);
        }
        if (findPost.userId !== userId) {
            throw new AuthenticationError('권한이 없습니다.', 401);
        }
        await this.postRepository.updatePost(userId, postId, postImg, content);
    };

    deletePost = async (userId, postId) => {
        const findPost = await this.postRepository.findPostById(postId);
        if (!findPost) {
            throw new ValidationError('존재하지 않는 게시글입니다.', 404);
        }
        if (findPost.userId !== userId) {
            throw new AuthenticationError('권한이 없습니다.', 401);
        }
        await this.postRepository.deletePost(userId, postId);
    };
}

module.exports = PostService;
