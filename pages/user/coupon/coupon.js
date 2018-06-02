// pages/user/coupon/coupon.js
const app = getApp()
var textUrl = app.globalData.textUrl
Page({
  data: {
    pagenumber: 1,
    pagesize: 10,
    uuid: '',
    hasMoreData: true,
    contentlist: [],
  },
  getMoreInfo: function (message) {
    var that = this;
    var param = {
      "pagenumber": this.data.pagenumber,
      "pagesize": this.data.pagesize,
      "uuid": this.data.uuid
    }
    // 获取优惠券
    wx.request({
      url: textUrl + 'user/myCouponList',
      data: param,
      method: "post",
      header: {
        "Content-Type": "application/json;charset=UTF-8"  //post
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }
      },
      success: function (res) {
        var datalist = res.data.datalist;
        var datalistNew = [];
        for (let i = 0; i < datalist.length; i++) {
          var data = new Object();
          data.amount = datalist[i].amount; 
          data.title = datalist[i].title; 
          data.buy_amount = '满' + datalist[i].buy_amount + '减' + datalist[i].amount; 
          data.time = datalist[i].apply_date + datalist[i].invalid_date;
          if (datalist[i].ranges==null){
            data.desc = '仅限无人货架使用'; 
          }else{
            data.desc = datalist[i].ranges; 
          }
          if (datalist[i].is_expired==true){
            data.use='已失效'
            data.useStyle = false
          }else{
            if (datalist[i].is_used == true){
              data.use = '已使用'
              data.useStyle = false
            }else{
              data.use = '立即使用'
              data.useStyle = true
            }
          }
          datalistNew.push(data)
          console.log(datalistNew)
        }
        var contentlistTem = that.data.contentlist
        var contentlist = datalistNew;
        if (contentlist.length < that.data.pageSize) {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: false
          })
        } else {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: true,
            pagenumber: that.data.pagenumber + 1
          })
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this
    var uuid = wx.getStorageSync('userarg') || ''
    this.setData({                // 最后赋值到data中渲染到页面
      uuid: uuid
    });
    that.getMoreInfo('正在加载数据...')
  },
  onShow: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getMoreInfo('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  }
})