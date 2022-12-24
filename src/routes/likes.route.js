const express = require('express');
const router = express.Router();
const LikesController = require('../controllers/likes.controller');
const likesController = new LikesController();
const authUserMiddleware = require('../middlewares/authUser.middleware');

router.put('/:postId/like', authUserMiddleware, likesController.checkPostLike);

module.exports = router;
