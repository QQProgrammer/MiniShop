const app = getApp()
var uuid = app.globalData.uuid
var textUrl = app.globalData.textUrl
var smallImgUrl = app.globalData.imgUrl
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,//订单号
    orderIfo:{},
    productList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//30763 options.orderId
    this.data.orderId = options.orderId
    //orderIfo.orderNum 设置订单号分割
    this.requestOrderDetal()
    //this.spliceOrderNum()
    // console.log(this.data)
  },
  copyBtn: function (e){//复制订单号
    console.log(e.currentTarget.dataset.ordernum)
    var self = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.ordernum.toString(),
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    });  
  },
  requestOrderDetal:function (){//获取订单详情
    var self = this;
    var url = textUrl+'oms/getOrderLocal?uuid='+uuid+'&oid='+ this.data.orderId
    wx.request({//
      url: url,
      // data: data,
      method: "get",
      header: {
        "Content-Type": "application/text"
      },
      success: function (res) {
        console.log(res)
        var dataAll = res.data
        //订单状态
        if (dataAll.order_status =='completed'){//
          dataAll.order_status = '订单已完成'
        }else{
          dataAll.order_status = '订单未完成'
        }
        //productImg
        dataAll.orderItems.map((item) =>{
          if (item.proimg == null){
            item.productImg = '/static/images/no_img.png'
          }else{
            item.productImg = util.getSmallImge(0, 300, "product_cover", item.proimg);
          }
          
        })
        self.setData({
          orderIfo: dataAll
        });
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '请求数据失败',
          icon: 'none',
          duration: 2000
        })
      }
    }) 

  },
  spliceOrderNum:function (){//订单号分割
    var orderNumLength = Math.ceil(this.data.orderIfo.orderNum.length / 4)
    var self = this
    var arr = []
    for (var i = 0; i < orderNumLength; i++) {
      var str = self.data.orderIfo.orderNum.substring(i * 4, i * 4 + 4)
      arr.push(str)
    }
    this.setData({
      'orderIfo.orderNumSplice': arr.join(' ')
    });
  },
  contactService: function (){//联客服
    //4001688810
    wx.makePhoneCall({
      phoneNumber:'4001688810'
    })
  },
  deletOrderBtn: function (e) {//删除订单
    //console.log(e.currentTarget.dataset)
    var self = this
    wx.showModal({
      title: '删除',
      content: '您确定要删除此订单吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: textUrl+'oms/cancelOmsOrder',
            data:{
              openid:'',
              uuid:uuid,
              sn: e.currentTarget.dataset.sn
            },
            method:'post',
            success:function (res){
              // self.requestOrderList()//刷新数据
            },
            fail:function (res){

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
 
})