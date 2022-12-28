const express = require('express');
const router = express.Router();
const authUserMiddleware = require('../middlewares/authUser.middleware.js');
const FollowController = require('../controllers/follow.controller');
const followController = new FollowController();

router.get('/:userId', authUserMiddleware, followController.getFollowList);

router.put('/:userId', authUserMiddleware, followController.editFollow);

module.exports = router;
