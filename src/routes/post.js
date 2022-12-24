const express = require('express');
const router = express.Router();
const upload = require('../modules/postImg');

const PostController = require('../controllers/post.controller');
const postController = new PostController();

// 게시글 작성
router.post('/', upload.single('postImg'), postController.createPost);
// 게시글 수정
router.put('/:postId', upload.single('postImg'), postController.updatePost);
// 게시글 삭제
router.delete('/:postId', postController.deletePost);
// 게시글 전체조회
router.get('/', postController.getPosts);
// 게시글 상세조회
router.get('/:postId', postController.getPostById);

module.exports = router;
