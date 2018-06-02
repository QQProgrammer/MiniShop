const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
Page({
  data: {
    payMoney: 200,//支付金额
    clock: ''//剩余支付时间
  },
  onLoad: function (options) {
    countdown(this);
  },
  toPay: function () {
    //调取支付接口
    //获取后台返回参数，传入后台获取参数，调取微信支付，成功后页面跳转
    wx.redirectTo({//跳转支付成功页面
      url: '/pages/scan/paySuc'
    })
  }
})

var total_micro_second = 1800 * 1000;

/* 毫秒级倒计时 */
function countdown(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: dateformat(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    countdown(that);
  }
    , 10)
}

// 时间格式化输出，如3:25:19 86。每10ms都会调用一次
function dateformat(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);
  // 秒位
  var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = Math.floor((micro_second % 1000) / 10);
  return hr + ":" + min + ":" + sec + " ";
}


