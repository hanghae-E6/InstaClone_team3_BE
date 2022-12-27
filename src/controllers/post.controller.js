const PostService = require('../services/post.service.js');
const { InvalidParamsError } = require('../middlewares/exceptions/error.class');

class PostController {
    postService = new PostService();

    // 게시글 작성
    createPost = async (req, res, next) => {
        try {
            const { content } = req.body;
            const { userId } = res.locals;
            let postImg = undefined;

            if (req.file) {
                postImg = req.file.location;
            }
            if (!content || !postImg) {
                throw new InvalidParamsError();
            }

            const { postId } = await this.postService.createPost(
                userId,
                postImg,
                content
            );

            res.status(201).json({
                message: '게시글이 생성되었습니다.',
                postId: postId,
            });
        } catch (error) {
            next(error);
        }
    };

    // 게시글 전체조회
    getPosts = async (req, res, next) => {
        try {
            const posts = await this.postService.findAllPost();

            res.status(200).json({ posts: posts });
        } catch (error) {
            next(error);
        }
    };

    // 게시글 상세 조회
    getPostById = async (req, res, next) => {
        try {
            const { postId } = req.params;

            const post = await this.postService.findPostById(postId);
            const comments = await this.postService.findAllCommentById(postId);
            res.status(200).json({
                post: post,
                comments: comments,
            });
        } catch (error) {
            next(error);
        }
    };

    // 특정 유저 게시글 조회
    findUserPosts = async (req, res) => {
        try {
            const { userId } = req.params;
            const posts = await this.postService.findUserPosts(userId);
            res.status(200).json({ posts });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '게시물 조회에 실패하였습니다.',
            });
        }
    };

    // 게시글 페이지 조회
    getPostsByPage = async (req, res, next) => {
        try {
            const pageInfo = req.query;
            const pageNo = pageInfo.pageno;
            if (!pageInfo) {
                throw new InvalidParamsError();
            }
            const posts = await this.postService.getPostsByPage(pageNo);
            res.status(200).json({ posts: posts });
        } catch (error) {
            next(error);
        }
    };

    // 게시글 수정
    updatePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { userId } = res.locals;
            const { content } = req.body;
            let postImg = undefined;

            if (!content) {
                throw new InvalidParamsError();
            }
            if (req.file) {
                postImg = req.file.location;
            }
            await this.postService.updatePost(userId, postId, postImg, content);
            const updatedPost = await this.postService.findPostById(postId);
            res.status(200).json({
                message: '게시글이 수정되었습니다.',
                updatedPost: updatedPost,
            });
        } catch (error) {
            next(error);
        }
    };

    // 게시글 삭제
    deletePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { userId } = res.locals;

            await this.postService.deletePost(userId, postId);

            res.status(200).json({ message: '게시글이 삭제되었습니다.' });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = PostController;
