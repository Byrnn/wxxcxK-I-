const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
//const user = require('../../../services/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    showLoginDialog: false,
    blLogion :false,
    loginpage:'/pages/login/index'
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    //console.log("getCurrentPageUrlWithArgs=" + util.getCurrentPageUrlWithArgs(this));
    var blLogion = app.globalData.token != ""; 
    this.setData({
      userInfo: app.globalData.userInfo,
      blLogion: blLogion,
    });
    if (!blLogion)
    {
      wx.navigateTo({
        url: "/pages/login/index?frompage=" + util.getCurrentPageUrlWithArgs(this),
      });
    }
  },
  onReady: function() {

  },
  onShow: function () {
    console.log("token=" + app.globalData.token);
    var blLogion = app.globalData.token != ""; 
    this.setData({
      blLogion: blLogion,
    });
    if (!blLogion) {
      /*wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      wx.navigateTo({
        url: "/pages/login/index?frompage=" + util.getCurrentPageUrlWithArgs(this),
      });*/
    }
    else
    {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },

  onUserInfoClick: function() {
    /*if (wx.getStorageSync('token')) {

    } else {
      this.showLoginDialog();
    }*/
    var gourl = "";
    if (app.globalData.token!="") {
      gourl = "/pages/ucenter/account/account";
    } else {
      gourl = "/pages/login/index?f=ucenter";
    }
    wx.navigateTo({
      url: gourl,
    });
  },

  showLoginDialog() {
    this.setData({
      showLoginDialog: true
    })
  },

  onCloseLoginDialog () {
    this.setData({
      showLoginDialog: false
    })
  },

  onDialogBody () {
    // 阻止冒泡
  },

  onWechatLogin(e) {
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }
    util.login().then((res) => {
      return util.request(api.AuthLoginByWeixin, {
        code: res,
        userInfo: e.detail
      }, 'POST');
    }).then((res) => {
      console.log(res)
      if (res.errno !== 0) {
        wx.showToast({
          title: '微信登录失败',
        })
        return false;
      }
      // 设置用户信息
      this.setData({
        userInfo: res.data.userInfo,
        showLoginDialog: false
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
      wx.setStorageSync('token', res.data.token);
    }).catch((err) => {
      console.log(err)
    })
  },

  onOrderInfoClick: function(event) {
    wx.navigateTo({
      url: '/pages/ucenter/order/order',
    })
  },

  onSectionItemClick: function(event) {

  },

  // TODO 移到个人信息页面
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#007a4c',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.UserLogout, {
          }, 'POST');
          app.globalData.token = "";
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.setStorageSync('autologin', "0");
          wx.setStorageSync('reloadindex', "1");
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
})