const app = getApp()
Page({
  data: {
    scrollHeight:'',
    orderL:[],
    isHideLoadMore: true,
    pagenumber:1,//当前页数
    LoadMoreTitle:'正在加载',
    pagelen:null,//数组条数
    orderList:[
      // {
      //   create_date:'2018-05-04 16:40',
      //   order_status:'已完成',
      //   title:'卫龙大面筋',
      //   cunt:'3',
      //   pay_amount:'7.5',
      // },  
    ]
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
    console.log(e.currentTarget.dataset)
  },
  detailsBtn: function (e){//订单详情页
    wx.navigateTo({
      url: '/pages/user/order/orderDetail/orderDetail?orderId=' + e.currentTarget.dataset.orderid,
    })
  },
  requestOrderList:function (){//列表数据
    var self = this;
    var url = 'https://minisuperuat.shinshop.com/web/oms/getOrderList'
    var data = { pagenumber:this.data.pagenumber,pagesize:4,uuid:"41e88a10eb324a84aa14094255b4fbd6"}
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
          console.log(item)
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
        //q.concat( b )
        var orderList = self.data.orderList.concat(res.data.datalist)
        if (self.data.pagenumber = 1) {
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
    // console.log(this.data.pagelen)
    if (this.data.pagelen > this.data.orderList.length){
      this.setData({
        LoadMoreTitle: '加载更多',
        isHideLoadMore: false,
      })
      this.requestOrderList()
    }else{
      console.log('没更多')
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