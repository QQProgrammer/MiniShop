const app = getApp()
var textUrl = app.globalData.textUrl
var uuid = app.globalData.uuid
var smallImgUrl = app.globalData.smallImgUrl
var util = require('../../utils/util.js')
Page({
  data: {
    uuid: uuid,//用户id
    carts: '',        // 购物车列表
    totalPrice: '',      // 总价
    selectAllStatus: true,  // 全选状态，默认全选
    typeCart: 2,//二维码类型1为货架码，2为商品码
    sid: '',//货架id
    pid: '',//商品id
    smsOrder: '活动敬请期待中',//活动信息展示
    headHide: false,//头部活动是否隐藏
    smsorderid: '',//活动id
    smsOrderText: ''//去凑单名称
  },
  //---------------onLoad
  onLoad: function (options) {
    console.log(options)
    if (options.typeCart) {//如果存在扫码类型为打开小程序扫一扫进入
      this.setData({
        typeCart: Number(options.typeCart),
        pid: Number(options.pid)
      })
    } else {
      //扫描二维码直接进入页面
      var src = decodeURIComponent(options.q)
      this.setData({
        foodsCart: src
      })
    }
  },
  //---------------onShow
  onShow() {
    var that = this;
    if (this.data.typeCart == 1) {//是货架过来的
      var cartItems = wx.getStorageSync('cartItems')
      var sid = wx.getStorageSync('sid')
      for (let i = 0; i < cartItems.length; i++) {
        cartItems[i].selected = true;
      }
      wx.setStorage({
        key: "cartItems",
        data: cartItems
      })
      this.setData({
        sid: sid
      }),
      this.setData({
        carts: cartItems
      }),
        this.getTotalPrice();
      this.getSmsOrder();
    } else if (this.data.typeCart == 2) {//是商品过来的
      //  获取商品id调取商品详情
      wx.request({
        url: textUrl + 'pms/getProductLocal',
        data: {
          pid: that.data.pid
        },
        method: "get",
        header: {
          "Content-Type": "application/json;charset=UTF-8"  //get
        },
        complete: function (res) {
        },
        success: function (res) {
          wx.setStorage({
            key: 'bid',
            data: Number(res.data.bid),
            success: function (res) {
            }
          })
          // 缓存
          var cartItems = wx.getStorageSync('cartItems') || []
          var pid = res.data.id
          if (res.data.image == null) {
            res.data.image = '../../static/images/no_img.png'
          } else {
            res.data.image = util.getSmallImge(0, 300, "product_cover", res.data.image);
          }
          if (cartItems.length == 0) {
            cartItems.push({
              id: res.data.id,
              quantity: 1,
              price: res.data.price,
              title: res.data.name,
              goodsPicsInfo: res.data.image,
              selected: true
            })
          } else {
            //判断购物车缓存中是否已存在该货品
            for (var i = 0; i < cartItems.length; i++) {
              if (pid == cartItems[i].id) {
                cartItems[i].quantity++
              } else {
                cartItems.push({
                  id: res.data.id,
                  quantity: 1,
                  price: res.data.price,
                  title: res.data.name,
                  goodsPicsInfo: res.data.image,
                  selected: true,
                })
              }
            }
          }
          var sid = res.data.wms_shelves
          that.setData({
            carts: cartItems,
            sid: res.data.wms_shelves
          })
          //加入购物车数据，存入缓存
          wx.setStorage({
            key: 'cartItems',
            data: cartItems,
            success: function (res) {
            }
          })
          wx.setStorage({
            key: 'sid',
            data: sid,
            success: function (res) {
            }
          })
          let carts = cartItems;         // 获取购物车列表
          let total = 0;
          for (let i = 0; i < carts.length; i++) {     // 循环列表得到每个数据
            if (carts[i].selected) {          // 判断选中才会计算价格
              total += carts[i].quantity * carts[i].price;   // 所有价格加起来
            }
          }
          that.setData({                // 最后赋值到data中渲染到页面
            totalPrice: total.toFixed(2)
          });

        }
      })
      this.getSmsOrder();
    }
  },
  getSmsOrder() {
    var that = this;
    var smsOrder = ''
    var smsorderid = ''
    var smsOrderText = ''
    var cartItems = wx.getStorageSync('cartItems')
    let carts = cartItems;         // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {     // 循环列表得到每个数据
      if (carts[i].selected) {          // 判断选中才会计算价格
        total += carts[i].quantity * carts[i].price;   // 所有价格加起来
      }
    }
    var totalPrice = total.toFixed(2)
    // 获取是否含有下单活动信息
    wx.request({
      url: textUrl + 'sms/getSmsOrderList',
      data: {
        uuid: uuid,
        sid: that.data.sid
      },
      method: "get",
      header: {
        "Content-Type": "application/json;charset=UTF-8"  //get
      },
      complete: function (res) {
      },
      success: function (res) {
        if (res.data.type == 'money') {//满减活动
          if (totalPrice >= res.data.limit_amount) {
            smsOrder = "活动商品满" + res.data.limit_amount + "元减" + res.data.amount + "元"
            smsorderid = res.data.id
            smsOrder = ' '
            smsOrderText = ' 参加活动成功'
          } else {
            smsOrder = "活动商品满" + res.data.limit_amount + "元减" + res.data.amount + "元"
            smsorderid = res.data.id
            smsOrderText = '去凑单'
          }
        } else if (res.data.type == 'discount') {//满折活动
          if (totalPrice >= res.data.limit_amount) {
            smsOrder = "活动商品满" + res.data.limit_amount + "元" + res.data.discount * 0.1 + "折"
            smsorderid = res.data.id
            smsOrderText = ' 参加活动成功'
          } else {
            smsOrder = "活动商品满" + res.data.limit_amount + "元" + res.data.discount * 0.1 + "折"
            smsorderid = res.data.id
            smsOrderText = '去凑单'
          }
        } else {
          smsOrder = '活动敬请期待中'
          smsorderid = res.data.id
          smsOrderText = ' '
        }
        wx.setStorage({
          key: "smsorderid",
          data: smsorderid
        })
        wx.setStorage({
          key: "is_coupon_allowed",
          data: res.data.is_coupon_allowed
        })
        that.setData({
          smsOrder: smsOrder,
          smsorderid: smsorderid,
          smsOrderText: smsOrderText
        })
      }
    })
  },
  getTotalPrice() {//求总价
    let carts = this.data.carts;         // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {     // 循环列表得到每个数据
      if (carts[i].selected) {          // 判断选中才会计算价格
        total += carts[i].quantity * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                // 最后赋值到data中渲染到页面
      totalPrice: total.toFixed(2)
    });
  },
  selectList(e) {
    const index = e.currentTarget.dataset.index;  // 获取data- 传进来的index
    let carts = this.data.carts;          // 获取购物车列表
    const selected = carts[index].selected;     // 获取当前商品的选中状态
    carts[index].selected = !selected;       // 改变状态
    this.setData({
      carts: carts
    });
    this.getTotalPrice();              // 重新获取总价
    wx.setStorage({
      key: 'cartItems',
      data: carts,
      success: function (res) {
      }
    })
  },
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;  // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;      // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();                // 重新获取总价
  },// 增加数量
  addCount(e) {
    // console.log(this.data.carts)
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let quantity = carts[index].quantity;
    quantity = quantity + 1;
    carts[index].quantity = quantity;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    //加入购物车数据，存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: this.data.carts,
      success: function (res) {
      }
    })
  },
  // 减少数量
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let quantity = carts[index].quantity;
    if (quantity <= 1) {
      return false;
    }
    quantity = quantity - 1;
    carts[index].quantity = quantity;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    //加入购物车数据，存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: this.data.carts,
      success: function (res) {
      }
    })
  },
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index, 1);       // 删除购物车列表里这个商品
    this.setData({
      carts: carts
    });
    if (!carts.length) {         // 如果购物车为空
      this.setData({
        hasList: false       // 修改标识为false，显示购物车为空页面
      });
    } else {               // 如果不为空
      this.getTotalPrice();      // 重新计算总价格
    }
  },
  toSubmit: function () {
    var self =this
    if (this.data.totalPrice == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
    } else {
      var that = this;
      var orderitems = []
      var orderObj = new Object;
      var carts = this.data.carts;
      for (let i = 0; i < carts.length; i++) {
        let num = carts[i].quantity
        let pid = carts[i].id
        orderObj = { num, pid }
        orderitems.push(orderObj)
      }
      //获得数据
      var bid = wx.getStorageSync('bid') || ''
      wx.request({
        url: textUrl + 'oms/subBalance',
        data: {
          "orderitem": orderitems,
          "smsorderid": that.data.smsorderid,//下单活动id
          "uuid": uuid,
          "sid": that.data.sid,
          "bid": bid
        },
        method: "post",
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        complete: function (res) {
          if (res == null || res.data == null) {
            reject(new Error('网络请求失败'))
          }
        },
        success: function (res) {
          wx.setStorage({
            key: 'amount',
            data: res.data.amount,
            success: function (res) {
            }
          })
          wx.setStorage({
            key: 'pay_money',
            data: res.data.pay_amount,
            success: function (res) {
            }
          })

          //加入购物车数据，存入缓存
          wx.setStorage({
            key: 'cartItems',
            data: self.data.carts,
            success: function (res) {
            }
          })

          wx.redirectTo({//跳转到提交订单页面
            url: '/pages/orderPay/submit'
          })
        }
      })
      
    }
  },
  toAdd: function () {
    var sid = wx.getStorageSync('sid')
    if (this.data.typeCart == 1) {
      console.log(sid)
      wx.redirectTo({
        url: '/pages/scan/shelf?sid=' + sid
      })
    } else {
      this.toScan();
    }
  },
  toScan: function () {//扫一扫
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


})
