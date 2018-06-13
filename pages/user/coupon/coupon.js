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
          data.id = datalist[i].id;
          data.buy_amount = datalist[i].buy_amount;
          data.mjdesc = '满' + datalist[i].buy_amount + '减' + datalist[i].amount;
          data.time = datalist[i].apply_date + datalist[i].invalid_date;

          if (datalist[i].ranges == null) {
            data.desc = '仅限无人货架使用';
          } else {
            data.desc = datalist[i].ranges;
          }
          if (datalist[i].is_expired == true) {
            data.use = '已失效'
            data.useStyle = false
          } else {
            if (datalist[i].is_used == true) {
              data.use = '已使用'
              data.useStyle = false
            } else {
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
  },
  toUse: function (e) {
    //本地没有商品存储，点击立即使用优惠券跳转首页
    //本地有商品存储，点击立即使用优惠券跳回购物车提交订单页
    var cartItems = wx.getStorageSync('cartItems') || ''

    if (cartItems == '') {
      // //调取扫一扫
      // wx.navigateTo({//测试用
      //   url: '../../scan/scan'
      // })
      //下方为正确扫码
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          var url = res.result
          if (url.indexOf("?") != -1) {
            var str = url.split("?");
            if (str[1].indexOf("=") != -1) {
              var Request = str[1].split("=");
              if (Request[0] == 'pid') {
                wx.navigateTo({
                  url: '../../scan/cart?typeCart=2&&pid='+Request[1]
                })
              } else if (Request[0] == 'sid') {
                wx.navigateTo({
                  url: '../../scan/shelf?sid='+Request[1]
                })
              }
            }
          }
        }
      })

    } else {
      // console.log(e)
      var contentlist = this.data.contentlist
      var index = e.target.id
      if (contentlist[index].useStyle == true) {
        var useCoupons = contentlist[index].id
        var manAmount = contentlist[index].buy_amount
        var amount = contentlist[index].amount
        var title = contentlist[index].title

        wx.setStorage({//优惠券id
          key: 'useCoupon',
          data: useCoupons,
          success: function (res) {
          }
        })
        wx.setStorage({//减几
          key: 'amount',
          data: amount,
          success: function (res) {
          }
        })
        wx.setStorage({//
          key: 'manAmount',
          data: manAmount,
          success: function (res) {
          }
        })
        wx.setStorage({
          key: 'couponTitle',
          data: title,
          success: function (res) {
          }
        })
        wx.navigateTo({
          url: "../../orderPay/submit"
        })
      } else {
        wx.navigateTo({
          url: '../../orderPay/submit'
        })
      }
    }

  }
})