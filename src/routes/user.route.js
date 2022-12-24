const express = require('express');
const UserController = require('../controllers/user.controller');
const userController = new UserController();
const router = express.Router();
const authLoginMiddleware = require('../middlewares/authLogin.middleware');

router.post('/signup', userController.signUp);
router.get('/signup/findDup', userController.findDup);
router.post('/login', authLoginMiddleware, userController.logIn);

module.exports = router;
