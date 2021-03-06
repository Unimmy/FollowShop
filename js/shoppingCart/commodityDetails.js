(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			imgurls:'',					//大图，下载
			isCollection:false,			//收藏
			isChoose:true,			//选择
			name:'',				//商品名称，传给后台需要的
			infos:[],
			chooseClickImg:'0',		//0向右边箭头 1向下箭头
			colorIndex:'',			//颜色索引
			colorName:'',			//颜色名字
			specificationOrSize:'',		//规格或尺码    1规格     0尺码
			mysizeIndex:'',			//尺码或规格索引
			mysizeName:'',			//尺码或规格名字
			shopPrice:'',			//商品价格
			shopNum:'',				//商品数量
			chooseInput:'请选择颜色   型号   分类',			//选择的内容
			addCarId:'',			//添加购物车id
			type:0,				//区分是普通 还是从订单详情过来的 0普通  1是从订单详情过来的
			isActivity:'0',		//0没有活动  1有活动
			activity:{
				title:'',
				introduce:'',
				reduce:''
			},						//活动
			surePrice:{
				price:'',		//原价
				price1:'',		//现价
				price2:''		//折扣价
			}
		},
		methods:{
			turnTo:function(name,id,sizeNum,isShowshopCart){
				mui.openWindow({
				    url:name+'.html?id='+id+'&&size='+sizeNum+'&&isShowshopCart=1',
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
			showSinglePicture:function(ser,imgurl){
				$j('.btnarr').hide()
				var img = ser+imgurl;				
				this.imgurls = img 
					var timeOutEvent=0;
				$j(function(){
					$j("#touchArea").on({
						touchstart: function(e){
							timeOutEvent = setTimeout(function(){
								timeOutEvent = 0; 
							   $j('.btnarr').show()
							},500);
						},
						touchmove: function(){
			            	clearTimeout(timeOutEvent); 
					    	timeOutEvent = 0; 
						},
						touchend: function(){
					   		clearTimeout(timeOutEvent);
							if(timeOutEvent!=0){ 
							  $j('.btnarr').hide()
							} 
							return false; 
						}
					})
				});
			},
			//保存图片
			savePic:function(iscl){				
					$j('.btnarr').hide()
					if(iscl == 1){
						return
					}
				var dtask = plus.downloader.createDownload(this.imgurls, {}, function(d,status){
					// 下载完成
					if(status == 200){ 
						//mui.alert("Download success: " + d.filename);
						//alert( "Download success: " + d.filename );
						plus.gallery.save(d.filename,function() {//保存到相册方法
						mui.toast('已保存到手机相册');
						}, function() {
						mui.toast('保存失败，请重试！');
						})
					} else {
						mui.alert("Download failed: " + status); 
					}  
				});
				//dtask.addEventListener("statechanged", onStateChanged, false);
				dtask.start(); 

			},
			//点击收藏
			collectionBtn:function(){
				if(localStorage.getItem('uname') == null || localStorage.getItem('uname') == undefined){
					mui.alert('您还未登录，请先登录再进行操作',function(){
						app.turnToX('../loginRegister/login','login','1')
					},'div')
				}else{
					this.isCollection = !this.isCollection;
					if(this.isCollection == true){
						plus.nativeUI.showWaiting();
						NetUtil.ajax('/Collection/add',{
							commodityid:this.name,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r){
							plus.nativeUI.closeWaiting();
							console.log(r);
							if(r.status==200){
								mui.toast(r.message);
							}else{
								mui.toast(r.message);
							}
						})
					}else{
						plus.nativeUI.showWaiting();
						NetUtil.ajax('/Collection/delete',{
							id:this.name,
							type:'1',
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r){
							plus.nativeUI.closeWaiting();
							console.log(r);
							if(r.status==200){
								mui.toast('已取消收藏');
							}else{
								mui.toast(r.message);
							}
						})
					}
				}	
			},
			//客服
			kefuCall:function(){
				NetUtil.ajax('/member/selectClerkPhone',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(r);
					if(r.status==200){
						//e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了  
		                var btnArray = ['取消', '确定'];  
		                mui.confirm(''+r.data+'','请拨打客服电话', btnArray, function(e) { 
		                    if (e.index == 1) {  
								console.log('确定了');
								window.location.href="tel:"+r.data+"";	//拨打电话
		                    } else {  
								//info.innerText = '你点了取消按钮';  
								console.log('取消了');
		                    }  
		                },'div') 
					}else{
						mui.alert('您还未登录，请先登录再进行操作',function(){
							app.turnToX('../loginRegister/login','login','1')
						},'div')
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
				if(Obj.id == 'commodityDetails'){
					this.type = 1;
				}else{
					this.type = 0;
				}
				return Obj; 
			},
			//接受数据
			loadding:function(){
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/commodity/selectInfoByname',{
					name:this.name,
					type:this.type,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
//					console.log(JSON.stringify(r));
					console.log(r);
					if(r.status == 200){
						app.infos = r.data;
						app.name = r.data.commodity[0].ID;
						app.specificationOrSize = r.data.commodity[0].SPECIFICATIONS;
						app.numMaxNum();
						if(r.data.Collection.length == '0'){
							app.isCollection = false;
						}else{
							app.isCollection = true;
						}
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//选择参数
			chooseParameter:function(){
				this.isChoose = !this.isChoose;
				if(this.isChoose == true){
					app.chooseClickImg = 1;
				}else{
					app.chooseClickImg = 0;
				}
			},
			//选择颜色分类
			chooseColor:function(index,name,type){
				this.colorIndex = index;
				this.colorName = name;
				this.inventorySurplus();
				//选择颜色查询尺码状况
				NetUtil.ajax('/commodity/coloursize',{
					keyid:this.name,
					str:name,
					type:type
				},function(r){
					console.log(r);
					if(r.status==200){
						app.infos.mysize = r.data;
					}else{
						mui.toast(r.message);
					}
				})
				app.chooseSureBtn()
			},
			//选择规格或者尺码
			chooseSize:function(index,name,type){
				this.mysizeIndex = index;
				this.mysizeName = name;
				this.inventorySurplus();
				//选择尺码查询颜色状况
				NetUtil.ajax('/commodity/coloursize',{
					keyid:this.name,
					str:name,
					type:type
				},function(r){
					console.log(r);
					if(r.status==200){
						app.infos.colour = r.data;
					}else{
						mui.toast(r.message);
					}
				})
				app.chooseSureBtn()
			},
			//设置数量最大值
			numMaxNum:function(){
				var nbox = mui('.mui-numbox').numbox();
				var value = app.infos.num.NUM;
				nbox.options["max"]=value;
			},
			//查取库存剩余量
			inventorySurplus:function(){
				if(!this.colorName){
					return false;
				}else if(!this.mysizeName && this.specificationOrSize==0){
					return false;
				}else if(!this.mysizeName && this.specificationOrSize==1){
					return false;
				}else{
					NetUtil.ajax('/stock/selectbyparameter',{
						keyid:this.name,
						colour:this.colorName,
						mysize:this.mysizeName,
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid')
					},function(r){
						console.log(r);
						if(r.status==200){
							app.infos.num.NUM = r.data.num.NUM;
							app.shopPrice = r.data.price;
							app.numMaxNum();
						}else{
							app.infos.num.NUM = '0';
							app.shopPrice = '';
							app.numMaxNum();
						}
					})
				}
			},
			//选择完确定
			chooseSureBtn:function(){
				if(!this.colorName){
//					mui.toast('请选择颜色');
					return false;
				}else if(!this.mysizeName && this.specificationOrSize==0){
//					mui.toast('请选择商品尺码');
					return false;
				}else if(!this.mysizeName && this.specificationOrSize==1){
//					mui.toast('请选择商品规格');
					return false;
				}else{
//					plus.nativeUI.showWaiting();
					NetUtil.ajax('/stock/selectbyparameter',{
						keyid:this.name,
						colour:this.colorName,
						mysize:this.mysizeName, 
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid')
					},function(r){
						console.log(r);
						if(r.status==200){
							if(r.data.mPromotion == null){
								app.isActivity = 0;
							}else{
								app.activity = r.data.mPromotion;
								app.surePrice.price = r.data.price;
								app.surePrice.price1 = r.data.price1;
								app.surePrice.price2 = r.data.price2;
								app.isActivity = 1;
							}
							app.shopNum = mui('.mui-numbox').numbox().getValue();
							app.chooseClickImg = 0;
							app.chooseInput = app.colorName+''+ app.mysizeName+'×'+app.shopNum
							app.addCarId = r.data.id;
						}else{
							mui.alert(r.message,function(){},'div');
						}
					})
				}
			},
			//添加购物车
			addCar:function(){
				app.chooseSureBtn()
				if(localStorage.getItem('uname') == null || localStorage.getItem('uname') == undefined){
					mui.alert('您还未登录，请先登录再进行操作',function(){
						app.turnToX('../loginRegister/login','login','1')
					},'div')
				}else{
					if(!this.addCarId){
						mui.alert('请先选择商品类型',function(){},'div');
					}else{
						//plus.nativeUI.showWaiting();
						NetUtil.ajax('/card/add',{
							id:this.addCarId,
							index:'1',
							num:this.shopNum,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r){
						//plus.nativeUI.closeWaiting();
							if(r.status==200){
								mui.alert(r.message,function(){},'div');
	//							var shopCart = plus.webview.getWebviewById('views/shoppingCart/shoppingCart.html');
	//							mui.fire(shopCart, 'changeP', {  
	//				                name: 'name2'  //传往second.html的值  
	//				           	});
					           	app.loadding();
							}else{
								mui.alert(r.message,function(){},'div');
							}
						})
					}
				}
			},
			//立即购买
			purchaseImmediately:function(){
				app.chooseSureBtn()
				if(localStorage.getItem('uname') == null || localStorage.getItem('uname') == undefined){
					mui.alert('您还未登录，请先登录再进行操作',function(){
						app.turnToX('../loginRegister/login','login','1')
					},'div')
				}else{
					if(!this.addCarId){
						mui.alert('请先选择商品类型',function(){},'div');
					}else{
						this.turnTo('shopSettlement',''+this.addCarId+'',''+this.shopNum+'');
					}
				}
			},
			//点击购物车
			goShopCart:function(){
				this.chooseSureBtn()
				if(localStorage.getItem('uname') == null || localStorage.getItem('uname') == undefined){
					mui.alert('您还未登录，请先登录再进行操作',function(){
						app.turnToX('../loginRegister/login','login','1')
					},'div')
				}else{
					var shopCart = plus.webview.getWebviewById('views/shoppingCart/shoppingCart.html');
					
		           	setTimeout(function(){
		           		mui.fire(shopCart, 'changeP', {  
			                name: 'name2'  //传往second.html的值  
			           	});
		           	},0)
		           	this.turnTo('shoppingCart','views/shoppingCart/shoppingCart');
				}
			},
			//分享
//			shareBtn:function(){
//				mui.toast('分享功能暂未开放');
//			},
			//返回首页
			goHomeIndex:function(){
				var index = plus.webview.getWebviewById('index.html');
				var commodityDetails = plus.webview.getWebviewById('commodityDetails.html');
				var homeList = plus.webview.getWebviewById('homeList.html');
				var homeListC = plus.webview.getWebviewById('../homePage/homeList.html');
				plus.webview.close(commodityDetails);
				if(homeList){
					plus.webview.close(homeList);
				}
				if(homeListC){
					plus.webview.close(homeListC);
				}
				plus.webview.show(index);
//				$j('.mui-bar-tab').find('a').removeClass('mui-active');
//				$j('#homeBar').addClass('mui-active');
			}
		},
		created:function(){
			$j('.btnarr').hide()
			this.getUrlObj();
			this.loadding();
			console.log(this.name)
			window.addEventListener('comDetail', function(event) {
				app.loadding();
			}, false);
			window.addEventListener('changeP', function(event) {
				app.loadding();
			}, false);
//			console.log(this.store);
		},
		mounted:function(){
			mui.init();
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			/*轮播*/
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				grabCursor: true,
//				loop: true,
				observer: true, //修改swiper自己或子元素时，自动初始化swiper
				observeParents: true, //修改swiper的父元素时，自动初始化swiper
				autoplay: 5000,
				speed: 2000,
            	autoplayDisableOnInteraction : false,
				effect: 'fade',
				slidesPerView : 'auto',
				fade: {
					crossFade: true,
				}
			})
			
//			mui.plusReady(function(){
//			    plus.nativeUI.showWaiting();//这里是开始显示原生等待框
//			})   
			
		}
	});		 
})();
