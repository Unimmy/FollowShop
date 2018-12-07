(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			infos:[],
			id:'',			//id
			status:'0',		//0可以有退货  1属于未付款不能有退货
			isBuyAgin:'0',	//0可以再次购买 1不能再次购买
			address:{},		//地址
			orderType:'',	//区分用户和商户  用户 1  商户 2
			differenceKey:'1',	//普通是1  退货是2
		},
		methods:{
			turnTo:function(name,id,type){
				mui.openWindow({
				    url:name+'.html?id='+id+'&&type='+type,
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
				this.id = Obj.id;
				this.orderType = Obj.orderType;
				if(Obj.differenceKey == '11'){
					this.differenceKey = 2;
				}else if(Obj.differenceKey == '22'){
					this.differenceKey = 3;
				}else{
					this.differenceKey = 1;
				}
				console.log(this.orderType);
				return Obj; 
			},
			//加载数据
			loadding:function(){
//				console.log(this.id);
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/orders/selectbyordersid',{
					id:this.id,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
					console.log(r);
					if(r.status == 200){
						app.infos = r.data;
						app.address = r.data.address;
						if(app.infos.order[0].STATUS1 == '4'){
							app.status = 0;
						}else{
							app.status = 1;
						}
						if(app.infos.order[0].STATUS == '已完成'){
							app.isBuyAgin = 0;
						}else{
							app.isBuyAgin = 1;
						}
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			
		},
		created:function(){
			console.log(this.isReturnGoods)
 			this.getUrlObj();
 			this.loadding();
 			window.addEventListener('getData', function(event) {
//				console.log('sdfsdf')
				app.loadding();
			});
		},
		mounted:function(){
			//阻尼系数
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
//			var deceleration = mui.os.ios?0.003:0.0009;
//			mui('.mui-scroll-wrapper').scroll({
//				bounce: false,
//				indicators: true, //是否显示滚动条
//				deceleration:deceleration
//			});			
		}

	});		 
})();
