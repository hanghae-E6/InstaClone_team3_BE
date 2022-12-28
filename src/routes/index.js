const express = require('express');
const router = express.Router();

const commentRouter = require('./comments.route.js');
const likeRouter = require('./likes.route.js');

router.use('/posts', [likeRouter, commentRouter]);

router.use('/posts', require('./post'));
router.use('/user', require('./user.route.js'));
router.use('/follow', require('./follows.route.js'));

module.exports = router;
