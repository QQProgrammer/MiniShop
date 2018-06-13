const app = getApp()    // 加这句就可以使用app.js里的内容
var textUrl = app.globalData.textUrl
var imgUrl = app.globalData.imgUrl
var smallImgUrl = app.globalData.smallImgUrl

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
// 压缩图片方法

function getSmallImge(width, height, dir, name) {
  console.log(width)
  return smallImgUrl + width + "_" + height + "/" + dir + "/" + name.split(".")[0] + "_" + name.split(".")[1];
}

module.exports = {
  formatTime: formatTime,
  getSmallImge: getSmallImge,
  trim: trim
}
