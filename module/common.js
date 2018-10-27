let classCommon = function () {
	this.getIP = function (req) {
		var ip = req.headers['x-real-ip'] ||
			req.headers['x-forwarded-for'] ||
			req.socket.remoteAddress || '';
			// console.log('x-real-ip : '+req.headers['x-real-ip']);
			// console.log('x-forwarded-for : '+req.headers['x-forwarded-for']);
			// console.log('remoteAddress : '+req.socket.remoteAddress);
		if (ip.split(',').length > 0) {
			ip = ip.split(',')[0];
		}
		// console.log('ip : '+ip);
		return ip;
	};
};


module.exports = classCommon;