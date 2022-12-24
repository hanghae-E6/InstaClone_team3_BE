const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middlewares/auth-middleware');
const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();

router.post(
    '/:postId/comments',
    // authMiddleware,
    commentsController.createComment
);

router.delete(
    '/:postId/comments/:commentId',
    // authMiddleware,
    commentsController.deleteComment
);

module.exports = router;
