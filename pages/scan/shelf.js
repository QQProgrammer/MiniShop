const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
var smallImgUrl = app.globalData.smallImgUrl
var util = require('../../utils/util.js')
Page({
  data: {
    foodsData: '',
    sid: '',//货架码
    cartMoney: '0.00',//购物车价钱
    cartNum: '0',//购物车数量
    screenSite: "",//货架地址
    currentTab: 0,  //对应样式变化
    scrollTop: 0,  //用作跳转后右侧视图回到顶部
    screenArray: [], //左侧导航栏内容
    screenId: "",  //后台查询需要的字段
    childrenArray: [], //右侧内容
  },
  onLoad: function (options) {
    var cartItems = wx.getStorageSync('cartItems') || []
    var cartNum = 0;
    var total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      cartNum = cartNum + cartItems[i].quantity
      total += cartItems[i].quantity * cartItems[i].price;
    }
    var that = this;
    // 获取货架码
    console.log(options.sid)
    that.setData({
      sid: Number(options.sid),
      cartNum: cartNum,
      cartMoney: total.toFixed(2)
    })
    wx.setStorage({
      key: 'sid',
      data: Number(options.sid),
      success: function (res) {
      }
    })
    //获得数据
    wx.request({
      url: textUrl + 'pms/getByShelvesPorList',
      data: {
        sid: that.data.sid
      },
      method: "get",
      header: {
        "Content-Type": "application/json;charset=UTF-8"  //get
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }
      },
      success: function (res) {

        var foodsData = [];
        var foodsType = [];
        var foods = new Object();
        foodsData = res.data.prolist
        console.log(foodsData)
        for (let i = 0; i < foodsData.length; i++) {
          let screenName = foodsData[i].name,
            screenId = foodsData[i].id,
            foods = { screenName, screenId }
          foodsType.push(foods);
        }
        var bid = res.data.prolist[0].prolist[0].bid
        wx.setStorage({ key: "bid", data: Number(bid) })
        var prolists = res.data.prolist[0].prolist

        for (let i = 0; i < prolists.length; i++) {
          if (prolists[i].image == null) {
            prolists[i].image = '../../static/images/no_img.png'
          } else {
            prolists[i].image = util.getSmallImge(0, 300, "product_cover", prolists[i].image);
          }
        }
        console.log(prolists)
        that.setData({
          screenArray: foodsType,
          foodsData: res.data.prolist,
          childrenArray: prolists,
          screenSite: res.data.shname
        })
      }
    })
  },

  navbarTap: function (e) {
    var that = this;

    this.setData({
      currentTab: e.currentTarget.id,   //按钮CSS变化
      screenId: e.currentTarget.dataset.screenid,
      scrollTop: 0,   //切换导航后，控制右侧滚动视图回到顶部
    })
    //刷新右侧内容的数据
    var screenId = this.data.screenId;
    console.log(screenId);
    console.log(that.data.foodsData);
    for (let i = 0; i < that.data.foodsData.length; i++) {
      if (screenId == that.data.foodsData[i].id) {
        console.log(that.data.foodsData[i].prolist)
        var prolist = that.data.foodsData[i].prolist
        for (let i = 0; i < prolist.length; i++) {
          if (prolist[i].image == null || prolist[i].image =='../../static/images/no_img.png') {
            prolist[i].image = '../../static/images/no_img.png'
          } else {
            //console.log(prolist[i].image)
            if (prolist[i].image.indexOf("https") >=0){

            }else{
              prolist[i].image = util.getSmallImge(0, 300, "product_cover", prolist[i].image);
            }
          }
        }
        console.log(prolist)
        that.setData({
          childrenArray: prolist
        })
      }
    }
  },
  addGoods: function (e) {
    var that = this;
    var cartNum = that.data.cartNum
    var cartMoney = that.data.cartMoney
    cartNum++;
    var index = parseInt(e.currentTarget.id);
    cartMoney = (this.data.cartMoney * 100 + this.data.childrenArray[index].price * 100) / 100;
    //存储商品ID
    this.setData({
      cartNum: cartNum,
      cartMoney: cartMoney
    })

    // 缓存
    var cartItems = wx.getStorageSync('cartItems') || []
    // console.log(cartItems)
    var screenId = e.currentTarget.dataset.screenid
    //判断购物车缓存中是否已存在该货品
    var exist = cartItems.find(function (ele) {
      // console.log(ele)
      return ele.id === that.data.childrenArray[index].id
    })
    // console.log(exist)
    if (exist) {
      //如果存在，则增加该货品的购买数量
      exist.quantity++
    } else {
      cartItems.push({
        id: that.data.childrenArray[index].id,
        quantity: 1,
        price: that.data.childrenArray[index].price,
        title: that.data.childrenArray[index].name,
        goodsPicsInfo: that.data.childrenArray[index].image
      })
    }

    //加入购物车数据，存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: function (res) {
        //添加购物车的消息提示框
        wx.showToast({
          title: "添加购物车",
          icon: "success",
          durantion: 2000
        })
      }
    })
  },
  toSubmit: function () {
    wx.redirectTo({//跳转到授权页面
      url: '/pages/scan/cart?typeCart=1'
    })
  }
})