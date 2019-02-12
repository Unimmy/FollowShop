(function(){
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el:'#app',
		data:{
			infos:[],
			ticketId:'' //卡卷id
		},
		methods:{
			//卡片赠送
			shareTicket:function(){
				var btnArray = ['取消','确定']
				    mui.prompt('赠送卡片', '请输入被赠送人账号', '', btnArray, function(e) {
                    if (e.index == 1) {
                    	var touname=e.value
                    	if(!(/^1[34578]\d{9}$/.test(touname))){ 
						     mui.alert("手机号码有误，请重填",function(){},"div");  
						     return false; 
						    } 
                      	NetUtil.ajax("/Kb/Give",{
							id:app.ticketId,
							touname:touname,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r) {
							if(r.message == '赠送成功'){
								mui.alert('赠送成功',function(){
									var  ticketshare = plus.webview.getWebviewById('ticketshare.html');
									plus.webview.close(ticketshare);
								},'div');
							}else{
								mui.alert('赠送失败，请稍后再试',function(){},'div');
							}
						})
                    } else {
                       console.log("用户取消了")
                    }
                },'div')
			},
			//理品卡拆分
			ticketopen:function(){
				var btnArray = ['取消','确定']
				    mui.confirm('是否确定拆分礼品卡？', btnArray, function(e) {
                    if (e.index == 1) {
                       	NetUtil.ajax("/Kb/split_",{
							id:app.ticketId,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r) {
							if(r.message == '拆分成功'){
								mui.alert('拆分成功',function(){
									var  ticketshare = plus.webview.getWebviewById('ticketshare.html');
									plus.webview.close(ticketshare);
								},'div');
							}else{
								mui.alert('拆分失败，请稍后再试',function(){},'div');
							}
						})
                    } else {
                       console.log("用户取消了")
                    }
                },'div')
			},
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");	
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				this.ticketId = Obj.id
				return Obj; 
			},
			selectTickets:function(){
				NetUtil.ajax("/Kb/applist",{
					id:this.ticketId,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r) {
					app.infos = r.data
				})
			},
		},
		created:function(){
			this.getUrlObj()
			this.selectTickets()
		}
	})
})()
