var express = require('express');
var router = express.Router();

router.use('/auth', require("./auth"));
router.use('/checkin', require('./check-in'))

module.exports = router;