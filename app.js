//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    var uuid = wx.getStorageSync('userarg') || ''
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.setStorageSync('code', res.code)
          // console.log(res)
        } else {
          // console.log('登录失败！' + res.errMsg)
        }
      }
    });
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
   
    // that.setData({//本地存储给data赋值
    //   uuid: uuid
    // })
  },
 
  globalData: {
    userInfo: null,
    userTel:null,
    textUrl: 'https://minisuperuat.shinshop.com/web/',
    imgUrl:'http://s3.cn-north-1.amazonaws.com.cn/s3-004-shinho-dubbo-prd-bjs/datas/image/adsense/',
    smallImgUrl: 'https://minisuperuat.shinshop.com/web/imsmanager/image_',
    uuid: wx.getStorageSync('userarg') || '',//wx.getStorageSync('userarg') || ''  41e88a10eb324a84aa14094255b4fbd6
  }
})