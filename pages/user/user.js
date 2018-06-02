const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
Page({
  data: {
    navigatorItems: [
      { Icon: "/static/images/uesricon_01.png", Name: "我的订单" },
      { Icon: "/static/images/uesricon_02.png", Name: "我的地址" },
      { Icon: "/static/images/uesricon_03.png", Name: "个人信息" },
      { Icon: "/static/images/uesricon_04.png", Name: "我的消息" },
      { Icon: "/static/images/uesricon_05.png", Name: "邀请有礼" },
      { Icon: "/static/images/uesricon_06.png", Name: "申请入驻" },
      { Icon: "/static/images/uesricon_07.png", Name: "绑定店铺" },
      { Icon: "/static/images/uesricon_08.png", Name: "个人信息" },
      { Icon: "/static/images/uesricon_09.png", Name: "设置" }
    ],
    userImg: '',
    userName:'',
    userTel:''
  },
  toCoupon: function () {
    wx.navigateTo({
      url: '../user/coupon/coupon'
    })
  },
  onLoad: function () {
    var that = this;
    var userInfo = JSON.parse(wx.getStorageSync('userInfo') )|| {}
    var userTel = wx.getStorageSync('userTel') || ''
   
    for (var i in userInfo){
      console.log(userInfo[i])
    }
    
    this.setData({                // 最后赋值到data中渲染到页面
      userImg: userInfo.avatarUrl,
      userName:userInfo.nickName,
      userTel: userTel
    });
  },
  onShareAppMessage: function () {//转发分享
    return {
      title: '试试转发',
      path: '/page/user?id=123'
    }
  },
  myOrderBtn: function (e) {//跳转到订单列表
   // console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index==0){
      wx.navigateTo({//跳转到订单列表
        url: '/pages/user/order/orderList/orderList'
      })
    }
  },
  jumpIntegral:function (){//积分页面跳转
    wx.navigateTo({//跳转到订单列表
      url: '/pages/user/integral/integral'
    })
  }
})