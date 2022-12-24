const express = require('express');
const router = express.Router();
const LikesController = require('../controllers/likes.controller');
const likesController = new LikesController();
// const authMiddleware = require('../middlewares/auth-middleware.js');

router.put(
    '/:postId/like',
    // authMiddleware,
    likesController.checkPostLike
);

module.exports = router;
