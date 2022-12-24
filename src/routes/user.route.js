const express = require('express');
const UserController = require('../controllers/user.controller');
const userController = new UserController();
const router = express.Router();

router.post('/signup', userController.signUp);

module.exports = router;
