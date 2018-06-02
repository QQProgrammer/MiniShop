const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
const util = require('../../utils/util.js')
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
