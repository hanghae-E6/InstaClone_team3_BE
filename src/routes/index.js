const express = require('express');
const router = express.Router();

const commentRouter = require('./comments.route.js');
const likeRouter = require('./likes.route.js');

router.use('/posts', [likeRouter, commentRouter]);

module.exports = router;
