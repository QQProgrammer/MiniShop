const app = getApp()
var textUrl = app.globalData.textUrl
Page({
  data: {
    carts: '',        // 购物车列表
    totalPrice: '',      // 总价，初始为0F
    selectAllStatus: true,  // 全选状态，默认全选
    typeCart: 2,
    pid: '',//商品id
    uuid: app.globalData.uuid,
    sid: '',//货架id
    smsOrder: '活动敬请期待中',//活动信息展示
    headHide: false//头部活动是否隐藏
  },
  getTotalPrice() {
    let carts = this.data.carts;         // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {     // 循环列表得到每个数据
      if (carts[i].selected) {          // 判断选中才会计算价格
        total += carts[i].quantity * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                // 最后赋值到data中渲染到页面
      carts: carts,
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
    console.log(this.data.carts)
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
    if (this.data.totalPrice == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
    } else {
      //加入购物车数据，存入缓存
      wx.setStorage({
        key: 'cartItems',
        data: this.data.carts,
        success: function (res) {
        }
      })
      wx.redirectTo({//跳转到提交订单页面
        url: '/pages/scan/submit'
      })
    }
  },
  toAdd:function(){
    if (this.data.typeCart==1){
        wx.redirectTo({//跳转到提交订单页面
        url: '/pages/scan/shelf'
      })
    }else{
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
                url: '../scan/cart?typeCart=2&&pid=Request[1]'
              })
            } else if (Request[0] == 'sid') {
              wx.navigateTo({
                url: '../scan/shelf?sid=Request[1]'
              })
            }
          }
        }
      }
    })
  },
  onShow() {
    var that = this;
    if (this.data.typeCart == 1) {//是货架过来的
      var cartItems = wx.getStorageSync('cartItems')
      for (let i = 0; i < cartItems.length; i++) {
        cartItems[i].selected = true;
      }
      this.setData({
        carts: cartItems
      }),
        this.getTotalPrice();
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
          if (res == null || res.data == null) {
            reject(new Error('网络请求失败'))
          }
        },
        success: function (res) {
          console.log("进来了")
          // 缓存
          var cartItems = wx.getStorageSync('cartItems') || []
          var pid = res.data.id
          if (cartItems.length == 0) {
            cartItems.push({
              id: res.data.id,
              quantity: 1,
              price: res.data.price,
              title: res.data.name,
              goodsPicsInfo: res.data.image,
              selected: true,
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
          for (let i = 0; i < cartItems.length; i++) {
            cartItems[i].selected = true;
          }
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
    }


    // 获取是否含有下单活动信息
    wx.request({
      url: textUrl + 'sms/getSmsOrderList',
      data: {
        uuid: that.data.uuid,
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
        var smsOrder = ''
        // console.log(res.data)
        if (res.data.type == 'money') {//满减活动
          smsOrder = "活动商品满" + res.data.limit_amount + "元减" + res.data.amount + "元"
        } else if (res.data.type == 'discount') {//满折活动
          smsOrder = "活动商品满" + res.data.limit_amount + "元" + res.data.discount + "折"
        }else{
          smsOrder = '活动敬请期待中'
        }
        that.setData({
          smsOrder: smsOrder
        })
      }
    })

  },
  onLoad: function (options) {
    this.setData({
      typeCart: Number(options.typeCart),
      pid: Number(options.pid)
    })
    // console.log(this.data.pid)
    //扫描二维码直接进入页面
    // var src = decodeURIComponent(options.q)
    // this.setData({
    //   // foodsCart: src.match(/ pid=(S*)&share=1/)[1]
    //   foodsCart: src
    // }) 
  },
})
