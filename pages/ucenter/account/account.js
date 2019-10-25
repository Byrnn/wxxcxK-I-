var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    userInfo:{}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(options)
    if (app.globalData.token == "") {
      wx.navigateTo({
        url: "/pages/login/index?frompage=" + util.getCurrentPageUrlWithArgs(this),
      });
    }
    else {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})