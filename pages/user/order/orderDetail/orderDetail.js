Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,//订单号

    orderIfo:{
      // originalPrice:'11.5',//原价
      // preferential:'-1.5',//优惠
      // realPay:'11.5',//实付
      // orderNum:'1000837499997865732',
      // orderNumSplice:'',//分割后 订单号
      // payMethod:'账户余额',//支付方式
      // orderTime:'2018-05-04 16:40',//下单时间
    },
    productList:[
      {
        productImg:'https://s3-010-shinho-ecshool-prd-bjs.s3.cn-north-1.amazonaws.com.cn/Product/201805181644529044.png',
        productName:'可口可乐',
        productCunt:'2',
        productPrice:'5',
      },
      {
        productImg: 'https://s3-010-shinho-ecshool-prd-bjs.s3.cn-north-1.amazonaws.com.cn/Product/201805181644529044.png',
        productName: '趣多多',
        productCunt: '2',
        productPrice: '6.5',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var url = 'https://minisuperuat.shinshop.com/web/oms/getOrderLocal?uuid=41e88a10eb324a84aa14094255b4fbd6&oid=' + this.data.orderId
    var data = { oid: '710', uuid: "41e88a10eb324a84aa14094255b4fbd6" }
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
  }
 
})