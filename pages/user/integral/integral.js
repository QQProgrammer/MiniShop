Page({
  /**
   * 页面的初始数据
   */
  data: {
    integarl:null,//积分值
    integarlList:[
      {
        item_name:'百事可乐225ml百事可乐225ml百事可乐225ml百事可乐225ml',
        item_address:'无人货架',
        item_titme:'2018-05-04 16:40',
        item_integral:'1',
        state:1,
      },
      {
        item_name: '百事可乐225ml',
        item_address: '无人货架',
        item_titme: '2018-05-04 16:40',
        item_integral: '1',
        state: 0,
      },
      {
        item_name: '百事可乐225ml',
        item_address: '无人货架',
        item_titme: '2018-05-04 16:40',
        item_integral: '7',
        state: 1,
      },
    ]
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
    var url = 'https://minisuperuat.shinshop.com/web/user/getUserPoint?uuid=41e88a10eb324a84aa14094255b4fbd6'
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
    var url = 'https://minisuperuat.shinshop.com/web/user/findByPointRecordList'
    var DATA = { uuid: '41e88a10eb324a84aa14094255b4fbd6', pagesize: 4, pagenumber:1}
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