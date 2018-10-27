var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var classCom = require('../module/common');

comCom = new classCom();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.cookie("tokenC",crypto.createHash('md5').update(comCom.getIP(req)+(req.headers['user-agent'])).digest('hex'));
	res.render('index', { title: 'Berry' });
});

module.exports = router;
