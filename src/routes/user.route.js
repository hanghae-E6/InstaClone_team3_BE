const express = require('express');
const UserController = require('../controllers/user.controller');
const userController = new UserController();
const router = express.Router();
const upload = require('../modules/profileImg.js');
const authLoginMiddleware = require('../middlewares/authLogin.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware.js');

router.post('/signup', upload.single('profileImg'), userController.signUp);
router.get('/signup/findDup', userController.findDup);
router.post('/login', authLoginMiddleware, userController.logIn);
router.get('/:userId', userController.findOneUser);
router.put(
    '/:userId',
    authUserMiddleware,
    upload.single('profileImg'),
    userController.updateUser
);

module.exports = router;
