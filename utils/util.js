const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
var imgUrl = app.globalData.imgUrl

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//去左右空格;
function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, "");
}
// 获取广告
// posParam  位置参数 foot为支付后轮播图，banner为首页轮播图，indexfoot为首页底部广告
// dataParam 获取结果后赋值的参数在data内存在
function getAdsenseList(posParam,dataParam) {
    var that = this;
    wx.request({//获取轮播图
      url: textUrl + 'sms/getAdsenseList',
      data: {
        position: posParam
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
      var arrImg=res.data;
      for(let i=0;i<arrImg.length;i++){
        arrImg[i].image = imgUrl + arrImg[i].image
      }
        that.setData({
          dataParam: arrImg
        });
        console.log(res)
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
      }
    })
}
module.exports = {
  formatTime: formatTime,
  getAdsenseList: getAdsenseList,
  trim: trim
}
