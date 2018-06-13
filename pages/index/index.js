//index.js
//获取应用实例
const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
var imgUrl = app.globalData.imgUrl
var util = require('../../utils/util.js');
Page({
  data: {
    imgUrlsBanner: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    imgUrlsAct: [], //活动图片数组
    motto: '我要去我的页面',
    userInfo: {},
    hasUserInfo: false,
    isCover: false,//遮罩层
    userTel: true,
    nocancel: false,
    latitude: '',
    longitude: '',
    userCode: '',//用户验证码
    userNumber: '',//用户手机号
    sendCodeMsg: '发送验证码',//发送验证码
    currentTime: 60,
    disabled: false,//可点击
    code: '',
    uuid: '',
    valueinput: '',
    imageUser: '',
    disabled: false,
    intervalTime: ''
  },
  goToRecharge: function () {//点击充值有礼

  },
  goToShop: function () {//点击去购物

  },
  goToFeedback: function () {//点击意见反馈

  },
  toast: function () { //点击我的跳转
    wx.navigateTo({
      url: '../user/user'
    })
  },
  sendCode: function (e) {//发送验证码
    var that = this;
    if (that.data.userNumber == '') {
      wx.showToast({
        title: '请输入手机号',
        // icon: 'succes',
        duration: 1000,
        mask: true
      })
      return false
    } else {
      that.setData({
        sendCodeMsg: 60 + '秒',
        disabled: true
      })
      // 点击之后倒数验证码
      var currentTime = that.data.currentTime
      var intervalTime = setInterval(function () {
        currentTime--;
        that.setData({
          sendCodeMsg: currentTime + '秒',
          disabled: true,
          intervalTime: intervalTime
        })
        if (currentTime <= 0) {
          clearInterval(intervalTime)
          that.setData({
            sendCodeMsg: '发送验证码',
            currentTime: 60,
            disabled: false,
            intervalTime: intervalTime
          })
        }
      }, 1000)
      // 获取验证码接口，传手机号给后台，发送短信，自动赋值给input；
      wx.request({
        url: textUrl + 'user/registerCode',
        data: {
          phone: that.data.userNumber
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"  //post
        },
        complete: function (res) {
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
  },
  close: function () {//注册关闭
    wx.navigateBack({
      delta: 0
    })
  },
  makeSure: function () {//注册确认
    var that = this
    if (that.data.userNumber == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (that.data.userCode == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
      return false
    }
    wx.request({
      url: textUrl + 'user/register',
      data: {
        phone: that.data.userNumber,
        code: that.data.code,
        // openid: ' ',
        incode: that.data.userCode
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"  //post
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }
      },
      success: function (res) {
        if (res.data.arg == null) {
          var intervalTime = that.data.intervalTime
          clearInterval(intervalTime)
          that.setData({
            userTel: false,
            isCover: true,
            valueinput: '',
            sendCodeMsg: '发送验证码',
            currentTime: 60,
            disabled: false,
            userNumber: ''
          })
          wx.showModal({
            title: '提示',
            content: res.data.content
          })
        } else {
          wx.setStorage({ key: "userTel", data: that.data.userNumber }) //信息存本地
          wx.setStorage({ key: "userarg", data: res.data.arg }) //信息存本地
          that.setData({
            userTel: true,
            isCover: false
          })
        }
      },
      fail: function (res) {
      }
    })
  }, //用户名和密码输入框事件
  userNumberInput: function (e) {
    this.setData({
      userNumber: e.detail.value
    })
  },
  userCodeInput: function (e) {
    this.setData({
      userCode: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toAdsense: function (e) {
    var item = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../index/webView?url=' + item
    })
  },
  indexScan: function () {//扫一扫
    // wx.navigateTo({//测试用
    //   url: '../scan/scan'
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
                url: '../scan/cart?typeCart=2&&pid='+Request[1]
              })
            } else if (Request[0] == 'sid') {
              wx.navigateTo({
                url: '../scan/shelf?sid='+Request[1]
              })
            }
          }
        }
      }
    })
  },
  onLoad: function () {
    var that = this;
    wx.getStorage(
      {
        key: 'userInfo',
        success: function (res) {
          if (res.data) {
            var imageUrlJson = JSON.parse(res.data)
            that.setData({//本地存储给data赋值
              imageUser: imageUrlJson.avatarUrl,
            })
          }
        },
        fail: function (res) {
          wx.redirectTo({//跳转到授权页面
            url: '/pages/toLogin/toLogin'
          })
        },
        complete: function (res) { }
      }),
      wx.getStorage(
        {
          key: 'userTel',
          success: function (res) {
            if (res.data) {
              that.setData({//本地存储给data赋值
                userTel: res.data,
                isCover: false
              })
            }
          },
          fail: function (res) {
            that.setData({//本地存储给data赋值
              userTel: false,
              isCover: true
            })
          },
          complete: function (res) { }
        }),
      wx.getStorage(
        {
          key: 'code',
          success: function (res) {

            if (res.data) {
              that.setData({//本地存储给data赋值
                code: res.data,
              })
            }
          },
          fail: function (res) {
          },
          complete: function (res) { }
        })
    var uuid = wx.getStorageSync('userarg') || ''
    that.setData({//本地存储给data赋值
      uuid: uuid
    })

    // 下方为进入首页有缓存清空
    var cartItems = wx.getStorageSync('cartItems')
    if (cartItems) {
      wx.removeStorage({
        key: 'cartItems',
        success: function (res) {
        }
      })
    }
    var amount = wx.getStorageSync('amount')
    if (amount) {
      wx.removeStorage({
        key: 'amount',
        success: function (res) {
        }
      })
    }
    var carts = wx.getStorageSync('carts')
    if (carts) {
      wx.removeStorage({
        key: 'carts',
        success: function (res) {
        }
      })
    }
    var pay_money = wx.getStorageSync('pay_money')
    if (pay_money) {
      wx.removeStorage({
        key: 'pay_money',
        success: function (res) {
        }
      })
    }
    var is_coupon_allowed = wx.getStorageSync('is_coupon_allowed')
    if (is_coupon_allowed) {
      wx.removeStorage({
        key: 'is_coupon_allowed',
        success: function (res) {
        }
      })
    }

    var smsorderid = wx.getStorageSync('smsorderid')
    if (smsorderid) {
      wx.removeStorage({
        key: 'smsorderid',
        success: function (res) {
        }
      })
    }
    var useCoupon = wx.getStorageSync('useCoupon')
    if (useCoupon) {
      wx.removeStorage({
        key: 'useCoupon',
        success: function (res) {
        }
      })
    }
    var manAmount = wx.getStorageSync('manAmount')
    if (manAmount) {
      wx.removeStorage({
        key: 'manAmount',
        success: function (res) {
        }
      })
    }
    var sid = wx.getStorageSync('sid')
    if (sid) {
      wx.removeStorage({
        key: 'sid',
        success: function (res) {
        }
      })
    }
    var bid = wx.getStorageSync('bid')
    if (bid) {
      wx.removeStorage({
        key: 'bid',
        success: function (res) {
        }
      })
    }
    var payData = wx.getStorageSync('payData')
    if (payData) {
      wx.removeStorage({
        key: 'payData',
        success: function (res) {
        }
      })
    }

    var couponTitle = wx.getStorageSync('couponTitle')
    if (couponTitle) {
      wx.removeStorage({
        key: 'couponTitle',
        success: function (res) {
        }
      })
    }
  },
  onShow: function () {
    // 获取广告
    //  位置参数 foot为支付后轮播图，banner为首页轮播图，indexfoot为首页底部广告
    //  请求上部轮播图
    var that = this;
    wx.request({//获取轮播图
      url: textUrl + 'sms/getAdsenseList',
      data: {
        position: 'banner'
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
          imgUrlsBanner: arrImg
        });
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
    // 请求下部广告
    wx.request({//获取轮播图
      url: textUrl + 'sms/getAdsenseList',
      data: {
        position: 'indexfoot'
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
