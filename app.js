var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var crypto = require('crypto');



var indexRouter = require('./routes/index');
var classMsg = require('./module/classMessage');
var classCom = require('./module/common');

var app = express();

// 伪初始化信息
msgMsg = new classMsg();
comCom = new classCom();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

// 请求提交留言的处理
app.post('/commit', function (req, res) {
	let objInsert = { user: req.body.name, ct: req.body.ct, ip: comCom.getIP(req) };
	let objF = { message: 'ok' };
	msgMsg.insertMSG(objInsert);
	res.end(JSON.stringify(objF));
});

//获取最新信息
app.get('/getnow', function (req, res) {
	let objF = { message: '', msg: [] };
	let md5Req = crypto.createHash('md5').update(comCom.getIP(req) + (req.headers['user-agent'])).digest('hex');
	if (md5Req == req.cookies.tokenC) {
		objF.message = 'ok';
		objF.msg = msgMsg.getAllMsg();
		res.end(JSON.stringify(objF));
	} else {
		objF.message = 'err';
		res.end(JSON.stringify(objF));
	};
});

//获取历史信息
app.get('/getold', function (req, res) {
	//需链接MongoDB后重写
	let objF = { message: '', msg: [] };
	let md5Req = crypto.createHash('md5').update(comCom.getIP(req) + (req.headers['user-agent'])).digest('hex');

	if (md5Req == req.cookies.tokenC) {
		msgMsg.loadOldMSG(req.query.gettime, cbGotOldMsg);
		function cbGotOldMsg(arrResult) {
			if (arrResult.length > 0) {
				objF.message = 'ok';
				objF.msg = arrResult;
			} else {
				objF.message = 'nt';
			};
			res.end(JSON.stringify(objF));
		};
	} else {
		objF.message = 'err';
		res.end(JSON.stringify(objF));
	};
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
