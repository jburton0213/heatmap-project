var express = require('express');
var router = express.Router();
var mongodb = require('mongodb')

router.get('/', function (req, res, next) {
    res.render('search');
})

module.exports = router;