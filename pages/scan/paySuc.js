const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
var imgUrl = app.globalData.imgUrl
Page({
  data: {
    modalHidden: false,
    nocancel: false,
    cover: true,
    imgUrlsAct:'',
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
  },
  cancel: function () {
    this.setData({
      cover: false
    });
  },
  toAdsense: function (e) {
    var item = e.currentTarget.dataset.url;
    console.log(item)
    wx.navigateTo({
      url: '../index/webView?url=' + item
    })
  },
  onLoad:function(){
    var that=this;
    // 请求下部广告
    wx.request({//获取轮播图
      url: textUrl + 'sms/getAdsenseList',
      data: {
        position: 'foot'
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
        var arrImg = res.data;
        for (let i = 0; i < arrImg.length; i++) {
          arrImg[i].image = imgUrl + arrImg[i].image
        }
        that.setData({
          imgUrlsAct: arrImg
        });
        console.log(res)
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    })
  }
})