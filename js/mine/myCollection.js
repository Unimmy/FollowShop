(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			infos:[],
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10
			}
		},
		methods: {
			/*跳转详情页面*/
			turnToX: function(name,id,type) {
				mui.openWindow({
					url: name + '.html?type=' + type,
					id: id + '.html',
					styles: {
						popGesture: 'close'
					},
					extras: {
						//自定义扩展参数，可以用来处理页面间传值
					},
					createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
						duration: 200, //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
						event: 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
						extras: {} //窗口动画是否使用图片加速
					},
					waiting: {
						autoShow: true, //自动显示等待框，默认为true
						title: '加载中', //等待对话框上显示的提示内容
						options: {
							//width:120,等待框背景区域宽度，默认根据内容自动计算合适宽度
							//height:100,等待框背景区域高度，默认根据内容自动计算合适高度
						}
					}
				})
			},
			pulldownRefresh: function() { //下拉刷新具体业务实现
				this.sendInfo.pageNo = 1;
				this.getInfo();
			},
			pullupRefresh: function() { //上拉加载具体业务实现
				this.sendInfo.pageNo++;
				this.getInfo('up');
			},
			getInfo:function(type){
//				plus.nativeUI.showWaiting();
				NetUtil.ajax("/Collection/selectAll",{
					page:this.sendInfo.pageNo,
					rows:this.sendInfo.pageSize,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);
					console.log(JSON.stringify(r));
					//plus.nativeUI.closeWaiting();
					if(r.status == 200) {				 	
					 	if(type == 'up'){
					 		app.infos = app.infos.concat(r.data);
					 		console.log(JSON.stringify(r.data.length));
					 		if(r.data.length<=0){
					 			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							}else{
								mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
							}
//							app.sendInfo.pageAll = ~~(r.resData.count / app.sendInfo.pageSize) + 1;
//							mui('#pullrefresh').pullRefresh().endPullupToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll);
					 	}else{
					 		app.infos = r.data;	
					 		mui('#pullrefresh').pullRefresh().refresh(true);
					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(r.data.length<=0); 
//					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll); //refresh completed
					 		mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
					 	}
					} else {
						mui.alert(r.message,function(){},'div')
					}
				});
			},
			//取消收藏
			cancelCollection:function(id){
				console.log(JSON.stringify(id));
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/Collection/delete',{
					id:id,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
					console.log(r);
					if(r.status == 200){
						mui.alert('取消收藏成功',function(){
							console.log(123);
							app.pulldownRefresh();
						},'div')
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
		},
		created: function() {
			mui.init({
				swipeBack: false,
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						style: 'circle',
						color:'#ed7196',
						offset: '44px',
						contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						auto: true,
						callback: this.pulldownRefresh
					},
					up: {
						auto: false,
						contentrefresh: '正在加载...',
						callback: this.pullupRefresh
					}
				}
			});
		},
		mounted: function() {

		}
	});
})();