const app = getApp()
var uuid = app.globalData.uuid
var textUrl = app.globalData.textUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    integarl:null,//积分值
    integarlList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //f1a245
    this.requestIntegar()//获取积分值
    this.requestIntegarList()//获取积分明细列表

  },
  requestIntegar: function () {//获取积分值
    // this.data.integarlList.map((item) => {
    //   if (item.state == 1) {
    //     item.item_integral = "+" + item.item_integral
    //   } else {
    //     item.item_integral = "-" + item.item_integral
    //   }
    // })
    // this.setData({
    //   integarlList: this.data.integarlList
    // })
    var self = this;
    var url = textUrl+ 'user/getUserPoint?uuid='+uuid
    wx.request({//获取积分值
      url: url,
      method: "get",
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        //console.log(res)
        self.setData({
          integarl: res.data
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '积分值获取失败',
          icon: 'none',
          duration: 2000
        })
      }
    }) 
  },
  requestIntegarList:function (){
    var self = this;
    var url = textUrl+'user/findByPointRecordList'
    var DATA = { uuid: uuid, pagesize: 4, pagenumber:1}
    wx.request({//获取积分值
      url: url,
      method: "POST",
      data: DATA,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res)
        res.data.datalist.map((item) =>{
          if (item.type =='recharge'){//收入
            item.discount = '+' + item.discount
          }else{//支出
            item.discount = '-' + item.discount
          }
        })
        self.setData({
          integarlList: res.data.datalist
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '积分明细获取失败',
          icon: 'none',
          duration: 2000
        })
      }
    }) 
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
})