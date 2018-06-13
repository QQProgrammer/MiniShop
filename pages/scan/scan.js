const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
Page({
  data: {

  },
  shelf: function () {//货架码
    console.log("点击货架码")
    wx.navigateTo({
      url: 'shelf?sid=12'
    })
  },
  goods: function () {//商品码
    wx.navigateTo({
      url: 'cart?typeCart=2&&pid=55851'
    })
  }
})
