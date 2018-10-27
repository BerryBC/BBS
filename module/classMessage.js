let MongoClient = require('mongodb').MongoClient;
let url;
let fs = require('fs');
let path = require('path');
let jsonCFG = JSON.parse(fs.readFileSync(path.join(__dirname, '../cfg/cfg.json')));
url = 'mongodb://' + jsonCFG.user + ':' + jsonCFG.pw + '@localhost:' + jsonCFG.host + '/' + jsonCFG.dbName + ''

let classMessage = function () {
	let that = this;
	let arrMsg = [];
	let intMax = 20;
	this.CheckSen = function () {
		if (arrMsg.length > intMax) {
			arrMsg.splice(intMax, arrMsg.length - intMax);
		};
	};
	this.PushIn = function (eleForPush) {
		arrMsg.unshift(eleForPush);
		this.CheckSen();
	};
	this.setMax = function (intWantMax) {
		intMax = intWantMax;
	};
	this.getAllMsg = function () {
		return arrMsg;
	};
	this.insertMSG = function (eleMSG) {
		MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
			if (err) throw err;
			let dbo = db.db(jsonCFG.dbName);
			eleMSG.time = new Date();
			dbo.collection(jsonCFG.msgcol).insertOne(eleMSG, function (err, res) {
				if (err) throw err;
				that.PushIn({ _id: res.ops[0]._id.toString(), ct: res.ops[0].ct, user: res.ops[0].user, time: res.ops[0].time });
				db.close();
			});
		});
	};
	this.loadOldMSG = function (dateTime, funCB) {
		MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
			if (err) throw err;
			let dbo = db.db(jsonCFG.dbName);
			dateTime = new Date(dateTime);
			//搜索代码！！！
			dbo.collection(jsonCFG.msgcol).find({ time: { $lt: dateTime } }).sort({ time: -1 }).limit(10).toArray(function (err, result) {
				if (err) throw err;
				let arrResult = [];
				for (let intI = 0; intI < result.length; intI++) {
					const eleRe = result[intI];
					arrResult.push({ _id: eleRe._id.toString(), ct: eleRe.ct, user: eleRe.user, time: eleRe.time });
				};
				db.close();
				funCB(arrResult);
			});
		});

	};
	MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
		if (err) throw err;
		let dbo = db.db(jsonCFG.dbName);
		dateTime = new Date();
		dbo.collection(jsonCFG.msgcol).find({ time: { $lt: dateTime } }).sort({ time: -1 }).limit(10).toArray(function (err, result) {
			if (err) throw err;
			for (let intI = 0; intI < result.length; intI++) {
				const eleRe = result[intI];
				that.PushIn({ _id: eleRe._id.toString(), ct: eleRe.ct, user: eleRe.user, time: eleRe.time });
			};
			db.close();
		});
	});
};



module.exports = classMessage;