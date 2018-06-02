const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
Page({
  data: {
    carts: [],        // 购物车列表
    hasList: false,     // 列表是否有数据
    totalPrice: 0,      // 总价，初始为0
    hasCoupon: '无可用优惠券' //优惠券
  },
  onShow() {
    var cartItems = wx.getStorageSync('cartItems')
    this.setData({
      carts: cartItems
    })
    let carts = cartItems;         // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {     // 循环列表得到每个数据
      if (carts[i].selected) {          // 判断选中才会计算价格
        total += carts[i].quantity * carts[i].price;   // 所有价格加起来
      }
    }
    console.log(total)
    this.setData({                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  onLoad: function () {

  },
  toSubmit: function () {
    wx.removeStorage({
      key: 'cartItems',
      success: function (res) {
        console.log(res.data)
      }
    })
    wx.redirectTo({//跳转到授权页面
      url: '/pages/scan/pay'
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})