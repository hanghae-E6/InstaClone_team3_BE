const express = require('express');
const router = express.Router();
const authUserMiddleware = require('../middlewares/authUser.middleware');
const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();

router.post(
    '/:postId/comments',
    authUserMiddleware,
    commentsController.createComment
);

router.delete(
    '/:postId/comments/:commentId',
    authUserMiddleware,
    commentsController.deleteComment
);

module.exports = router;
