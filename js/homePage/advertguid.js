(function(){
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el:'#app',
		data:{
			name:''
		},
		methods:{
			turnTo:function(name,id,type){
				console.log(name)
				mui.openWindow({
				    url:name+'.html?type='+type,
				    id:name+'.html',
				    styles:{
				    	popGesture: 'close',
				    },
				    extras:{
				      //自定义扩展参数，可以用来处理页面间传值
				    },
				    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
				    show:{
				      autoShow:true,//页面loaded事件发生后自动显示，默认为true
				      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
				      duration:200,//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
				      event:'titleUpdate',//页面显示时机，默认为titleUpdate事件时显示
				      extras:{}//窗口动画是否使用图片加速
				    },
				    waiting:{
				      autoShow:true,//自动显示等待框，默认为true
				      title:'加载中',//等待对话框上显示的提示内容
				      options:{
				        //width:120,等待框背景区域宽度，默认根据内容自动计算合适宽度
				        //height:100,等待框背景区域高度，默认根据内容自动计算合适高度
				      }
				    }
				})
			},
			//获取URL后面的值
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				})
				this.name = Obj.type;
				return Obj; 
			},
			pulldownRefresh:function(){
				setTimeout(function(){
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				},1000)
			}
		},
		created:function(){
			this.getUrlObj();
				mui.init({
				swipeBack: false,
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						style:'circle',
						color:'#ed7196',
						offset:'44px',
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
	})
})()
