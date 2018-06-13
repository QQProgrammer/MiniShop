const app = getApp()
var uuid = app.globalData.uuid
var textUrl = app.globalData.textUrl

Page({
  data: {
    scrollHeight:'',
    orderL:[],
    isHideLoadMore: true,
    pagenumber:1,//当前页数
    LoadMoreTitle:'正在加载',
    pagelen:null,//数组条数
    orderList:[]
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight-28;
        that.setData({ scrollHeight: height });
      }
    })
    this.requestOrderList()
  },
  deletOrderBtn: function (e){//删除订单
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
              self.requestOrderList()//刷新数据
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
  detailsBtn: function (e){//订单详情页
    wx.navigateTo({
      url: '/pages/user/order/orderDetail/orderDetail?orderId=' + e.currentTarget.dataset.orderid,
    })
  },
  requestOrderList:function (){//列表数据
    var self = this;
    var url = textUrl+ 'oms/getOrderList'
    var data = { pagenumber: this.data.pagenumber, pagesize: 4, uuid: uuid }
    wx.request({//
      url:url,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {

        console.log(res)
        // self.data.orderList = res.datalist
        res.data.datalist.map((item) =>{
         // console.log(item)
          //商品名数据整理
          if (item.orderItems.length>1){
            item.title = item.orderItems[0].name+'...等'
          }else{
            item.title = item.orderItems[0].name + ''
          }
          item.cunt = item.orderItems.length
          //支付状态
          if (item.order_status == "completed"){
            item.order_status = '已完成'
          }else{
            item.order_status = '未完成'
          }
        })
        var orderList = self.data.orderList.concat(res.data.datalist)
        if (self.data.pagenumber == 1) {
          self.data.orderL = orderList
        }
        self.setData({
          orderList: orderList,
          pagelen: res.data.pagelen,
          LoadMoreTitle:'没有更多了',
          isHideLoadMore: true,
          pagenumber: self.data.pagenumber+1,
        })
      },
      fail: function (res){
        console.log(res)
        wx.showToast({
          title: '请求数据失败',
          icon: 'none',
          duration: 2000
        })
      }
    }) 
  },
  loadMore: function (){
    this.setData({
      isHideLoadMore: false,
    })
    console.log(this.data.orderL)
    if (this.data.pagelen > this.data.orderList.length){
      this.setData({
        LoadMoreTitle: '加载更多',
        isHideLoadMore: false,
      })
      this.requestOrderList()
    }else{
      //console.log('没更多')
      // setTimeout(() => {
      //   this.setData({
      //     LoadMoreTitle: '没有更多了',
      //     isHideLoadMore: true,
      //     orderList:this.data.orderList.concat(this.data.orderL)
      //   })
      // }, 700)
      
      setTimeout(() => {
        this.setData({
          LoadMoreTitle: '没有更多了',
          isHideLoadMore: true,
        })
      }, 700) 
    }
  },
})