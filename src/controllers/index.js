var express = require('express');
var router = express.Router();

router.use('/auth', require("./auth"));
router.use('/checkin', require('./check-in'))
// router.use('/chat', require('./chat'))

module.exports = router;