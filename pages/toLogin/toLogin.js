const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
Page({
  data: {
    eye: true
  },
  onLoad: function () {

  },
  onShow: function (options) {
    this.getUserInfoFun()
  },
  getUserInfoFun: function (e) {
    console.log(e)
    if (e) {
      if (e.detail.rawData) {
        this.setData({
          userInfo: e.detail.rawData,
          hasUserInfo: true,
          eye: false
        })
        console.log(this.data.userInfo)
        app.globalData.userInfo = e.detail.rawData
        wx.setStorage({ key: "userInfo", data: e.detail.rawData }) //信息存本地
        wx.redirectTo({//跳转到授权页面
          url: '/pages/index/index'
        })
      } else {
        wx.navigateBack({
          delta: 0
        })
      }

    }
  },
  showPrePage: function () {
    this.setData({
      eye: false
    })
  }
})