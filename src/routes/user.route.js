const express = require('express');
const UserController = require('../controllers/user.controller');
const userController = new UserController();
const router = express.Router();

router.post('/signup', userController.signUp);
router.get('/signup/findDup', userController.findDup);
//router.get('/signup/nickname', userController.findDupNickname);

module.exports = router;
