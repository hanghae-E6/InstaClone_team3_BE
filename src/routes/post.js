const express = require('express');
const router = express.Router();
const upload = require('../modules/postImg');
const authUserMiddleware = require('../middleWares/authUser.middleware');

const PostController = require('../controllers/post.controller');
const postController = new PostController();

// 게시글 작성
router.post(
    '/',
    upload.single('postImg'),
    authUserMiddleware,
    postController.createPost
);
// 게시글 수정
router.put(
    '/:postId',
    upload.single('postImg'),
    authUserMiddleware,
    postController.updatePost
);
// 게시글 삭제
router.delete('/:postId', authUserMiddleware, postController.deletePost);
// 게시글 전체조회
router.get('/', authUserMiddleware, postController.getPosts);
// 게시글 상세조회
router.get('/:postId', authUserMiddleware, postController.getPostById);

module.exports = router;
