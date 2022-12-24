const express = require('express');
const router = express.Router();

router.use('/api/user', require('./user.route.js'));

module.exports = router;
