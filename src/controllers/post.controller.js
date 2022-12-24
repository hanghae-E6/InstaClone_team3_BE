const PostService = require('../services/post.service.js');
const { InvalidParamsError } = require('../middleWares/exceptions/error.class');

class PostController {
    postService = new PostService();

    // 게시글 작성
    createPost = async (req, res, next) => {
        try {
            const { content } = req.body;
            const { userId } = res.locals;
            let postImg = undefined;

            if (!content) {
                throw new InvalidParamsError();
            }
            if (req.file) {
                postImg = req.file.location;
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

            res.status(200).json({
                post: post,
            });
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
