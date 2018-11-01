let classGBVar = function () {
	this.intMsg = 0;
	this.dictMsg = [];
	this.timerRefresh;
	this.dateFirst = new Date();
	this.dateLast = new Date(0);
	this.bolLoading = false;
	this.arrColor = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
	this.addMessage = function (eleMsg, intAP) {
		let divContent = $('#divContent');
		let strColor = this.arrColor[Math.ceil(Math.random() * this.arrColor.length - 0.000001)];
		eleMsg.time = new Date(eleMsg.time);
		if (eleMsg.time > this.dateLast) this.dateLast = eleMsg.time;
		if (eleMsg.time < this.dateFirst) this.dateFirst = eleMsg.time;
		eleMsg.user = decodeURI(eleMsg.user);
		eleMsg.ct = decodeURI(eleMsg.ct);
		let h5Title = document.createElement('h5');
		h5Title.className = 'card-title font-weight-bold';
		h5Title.innerText = eleMsg.user + ' 说 ';
		let pContent = document.createElement('p');
		pContent.className = 'card-text';
		pContent.innerText = eleMsg.ct;
		let divTC = document.createElement('div');
		divTC.className = 'card-body text-' + strColor;
		divTC.append(h5Title);
		divTC.append(pContent);
		let divCarFoot = document.createElement('div');
		divCarFoot.className = 'card-footer bg-transparent border-' + strColor + ' text-right'
		divCarFoot.innerText = 'by ' + eleMsg.user + ' | at ' + eleMsg.time.toLocaleString();

		let divOneCard = document.createElement('div');
		divOneCard.className = 'card border-' + strColor + ' mb-3 MSGCard'
		divOneCard.append(divTC);
		divOneCard.append(divCarFoot);
		$(divOneCard).hide();
		if (intAP == 0) {
			divContent.prepend(divOneCard);
		} else {
			divContent.append(divOneCard);
		};
		$(divOneCard).fadeIn(); ('slow');
	};
	this.compareForTimeP = function (x, y) {
		//比较函数
		x.time = new Date(x.time);
		y.time = new Date(y.time);
		if (x.time < y.time) {
			return -1;
		} else if (x.time > y.time) {
			return 1;
		} else {
			return 0;
		}
	};
	this.compareForTimeN = function (x, y) {
		//比较函数
		x.time = new Date(x.time);
		y.time = new Date(y.time);
		if (x.time < y.time) {
			return 1;
		} else if (x.time > y.time) {
			return -1;
		} else {
			return 0;
		}
	};
};
let gbVar = new classGBVar();

$(function () {
	let btnSubmit = $('#btnSubmit');
	let txtName = $('#txtName');
	let txtCT = $('#txtCT');
	function funGetName() {
		let intMonth = (new Date).getMonth();
		let arrMonth = ['大寒', '立春', '惊蛰', '清明', '立夏', '夏至', '小暑', '立秋', '秋分', '寒露', '立冬', '冬至'];
		let arrNC = ['大熊', '小熊', '猫', '小狗', '狗熊', '鳄鱼', '熊本熊', '哈士奇', '比卡丘', '诗人', '教师', '网优', '吉他手', '鼓手', '美女', '中年男人', '学生', '旖旎之人', '错误', '悔恨', '幸福', '浪子'];
		let arrEMO = ['痛苦', '难过', '欢快', '愉快', '愤怒', '莫名其妙', '恋爱中', '伤感', '莫名', '发呆', '傻傻', '痴呆', '恶心'];
		return arrMonth[intMonth] + '里' + arrEMO[Math.floor(Math.random() * arrEMO.length - 0.0001)] + '的' + arrNC[Math.floor(Math.random() * arrNC.length - 0.0001)];
	};



	//-----------------------------
	//保存用户的Cookies，保存用户当前用户名

	//即时获取当前信息
	function funGetUpdate() {
		$.ajax({
			url: "getnow",
			type: "GET",
			dataType: "json",
			data: { gettime: gbVar.dateLast.valueOf() },
			success: function (data) {
				if (data.message == 'ok') {
					let arrGotMsg = data.msg.sort(gbVar.compareForTimeP);
					arrGotMsg.forEach(function (eleMsg) {
						if (!gbVar.dictMsg[eleMsg._id]) {
							gbVar.dictMsg[eleMsg._id] = true;
							gbVar.addMessage(eleMsg, 0);
							gbVar.intMsg++;
						};
					});
				} else {
					console.log('错误了。');
				};
			},
			error: function (err) {
				console.log(err);
			}
		});

	};
	funGetUpdate();
	gbVar.timerRefresh = setInterval(funGetUpdate, 6000);


	//滚动刷新
	window.onscroll = function()  {
		let intNowTop = document.documentElement.scrollTop || document.body.scrollTop;
		let intWinH = document.documentElement.clientHeight || document.body.clientHeight;
		let intBodyH = document.documentElement.offsetHeight || document.body.offsetHeight;
		if (intBodyH < (intNowTop + intWinH + 400) && !gbVar.bolLoading) {
			gbVar.bolLoading = true;
			$.ajax({
				url: "getold",
				type: "GET",
				dataType: "json",
				data: { gettime: gbVar.dateFirst.valueOf() },
				success: function (data) {
					if (data.message == 'ok') {
						let arrGotMsg = data.msg.sort(gbVar.compareForTimeN);
						arrGotMsg.forEach(function(eleMsg) {
							if (!gbVar.dictMsg[eleMsg._id]) {
								gbVar.dictMsg[eleMsg._id] = true;
								gbVar.addMessage(eleMsg, 1);
								gbVar.intMsg++;
							};
						});
						gbVar.bolLoading = false;
					} else if (data.message == 'nt') {
						$('#divGetHistory').removeClass('alert-primary');
						$('#divGetHistory').addClass('alert-secondary');
						$('#divGetHistory').html('<b>已经加载完毕了哟~</b>');
						gbVar.bolLoading = true;
					}
					else {
						console.log('错误了。');
						setTimeout(function()  {
							gbVar.bolLoading = false;
						}, 3000);
					};
				},
				error: function (err) {
					console.log(err);
					setTimeout(function()  {
						gbVar.bolLoading = false;
					}, 3000);
				}
			});
		};
	};


	//上传事件
	txtName.val(funGetName());
	btnSubmit.click(function (e) {
		let formData = new FormData();
		txtCT.val(txtCT.val().replace(/\n{3,}/g, '\n\n'));
		formData.append('name', txtName.val());
		formData.append('ct', txtCT.val());
		btnSubmit.addClass('disabled');
		btnSubmit.attr('disabled', true);
		btnSubmit.text('提交中...');
		$.ajax({
			url: "commit",
			type: "POST",
			dataType: "json",
			data: {
				'name': encodeURI(txtName.val()),
				'ct': encodeURI(txtCT.val())
			},
			success: function (data) {
				if (data.message == 'ok') {
					btnSubmit.removeClass('disabled');
					btnSubmit.attr('disabled', false);
					txtName.val(funGetName());
					txtCT.val('');
					btnSubmit.addClass('btn-warning');
					btnSubmit.removeClass('btn-danger');
					btnSubmit.text('提交留言哟~');
					$('#modalShow').modal('show');
					funGetUpdate();
				} else {
					btnSubmit.removeClass('disabled');
					btnSubmit.attr('disabled', false);
					btnSubmit.text('服务器问题，请重新提交');
					btnSubmit.removeClass('btn-warning');
					btnSubmit.addClass('btn-danger');
				};
			},
			error: function (err) {
				console.log(err);
				btnSubmit.removeClass('disabled');
				btnSubmit.attr('disabled', false);
				btnSubmit.text('网络原因提交失败，请重新提交');
				btnSubmit.removeClass('btn-warning');
				btnSubmit.addClass('btn-danger');
			}
		});
	});
});
