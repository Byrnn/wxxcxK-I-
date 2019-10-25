var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    userInfo: {},
    showLoginDialog: false,
    blLogion: false,
  },
  onLoad: function (options) {
    console.log(app.globalData.userInfo);
    this.data.blLogion = app.globalData.token != "";
    if (!this.data.blLogion) {
      wx.navigateTo({
        url: "/pages/login/index?frompage=" + util.getCurrentPageUrlWithArgs(this),
      });
    }
    else{
      this.setData({
        userInfo: app.globalData.userInfo,
      });
      //this.data.userInfo = app.globalData.userInfo;
    }
  },
  /*bindWeChat: function () {
    var that = this;
    if (app.globalData.token != "") {
      wx.login({
        success: wxres => {
          console.log(wxres.code);
          if (wxres.code)
          {
            util.request(api.UserBindWeChat, {
              wxcode: wxres.code,
            }, 'POST').then(function (res) {
              console.log(res);
              if (res.errno == 0) {
                app.globalData.userInfo.bindWeChat = true;
                wx.getUserInfo({
                  success: function (wxuserinfo) {
                    app.globalData.userInfo.OpenUserNickName = wxuserinfo.userInfo.nickName;
                    app.globalData.userInfo.avatar = wxuserinfo.userInfo.avatarUrl;
                    //保存微信登录参数
                    util.request(api.SaveWeChatUserInfo, {
                      avatarUrl: wxuserinfo.userInfo.avatarUrl,
                      nickName: wxuserinfo.userInfo.nickName,
                      gender: wxuserinfo.userInfo.gender,
                      country: wxuserinfo.userInfo.country,
                      province: wxuserinfo.userInfo.province,
                      city: wxuserinfo.userInfo.city,
                    }, 'POST').then(function (saveRes) {
                      console.log(saveRes);
                      if (saveRes.errno == 0) {
                        wx.showToast({
                          title: '绑定成功',
                        });
                        wx.setStorageSync('autologin', "1");
                        that.onLoad()//重新执行下onLoad去获取当前的数据
                      }
                      else {

                      }
                    });
                  }
                });
              }
              else {

              }
            });
          }
          else{
            wx.showToast({
              title: '获取微信code失败，请重试',
              icon: 'none'
            });
          }
        }
      });
    }
    else {
      wx.navigateTo({
        url: "/pages/login/index?f=ucenter",
      })
    }
    
  },*/

  bindGetUserInfo: function (e) {
    var that = this;
    //此处授权得到userInfo
    console.log(e.detail.userInfo);
    //接下来写业务代码
    if (e.detail.userInfo == null || e.detail.userInfo=="undefined"){
      util.showErrorToast('您已取消授权');
    }
    else{
      if (app.globalData.token != "") {
        wx.login({
          success: wxres => {
            console.log(wxres.code);
            if (wxres.code) {
              util.request(api.UserBindWeChat, {
                wxcode: wxres.code,
                avatarUrl: e.detail.userInfo.avatarUrl,
                nickName: e.detail.userInfo.nickName,
                gender: e.detail.userInfo.gender,
                country: e.detail.userInfo.country,
                province: e.detail.userInfo.province,
                city: e.detail.userInfo.city,
              }, 'POST').then(function (res) {
                console.log(res);
                if (res.errno == 0) {
                  app.globalData.userInfo.bindWeChat = true;
                  app.globalData.userInfo.OpenUserNickName = e.detail.userInfo.nickName;
                  app.globalData.userInfo.nickname = e.detail.userInfo.nickName;
                  app.globalData.userInfo.avatar = e.detail.userInfo.avatarUrl; 
                  wx.setStorageSync('autologin', "1");
                  wx.showToast({
                    title: '绑定成功',
                  });
                  that.onLoad()//重新执行下onLoad去获取当前的数据

                  /*
                  //保存微信登录参数
                  util.request(api.SaveWeChatUserInfo, {
                    avatarUrl: e.detail.userInfo.avatarUrl,
                    nickName: e.detail.userInfo.nickName,
                    gender: e.detail.userInfo.gender,
                    country: e.detail.userInfo.country,
                    province: e.detail.userInfo.province,
                    city: e.detail.userInfo.city,
                  }, 'POST').then(function (saveRes) {
                    console.log(saveRes);
                    if (saveRes.errno == 0) {
                      wx.showToast({
                        title: '绑定成功',
                      });
                      wx.setStorageSync('autologin', "1");
                      that.onLoad()//重新执行下onLoad去获取当前的数据
                    }
                    else {
                      wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: saveRes.errMsg
                      });
                    }
                  });
                  */
                }
                else {
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: res.errMsg
                  });
                }
              });
            }
            else {
              wx.showToast({
                title: '获取微信code失败，请稍后重试',
                icon: 'none'
              });
            }
          }
        });
      }
      else {
        wx.navigateTo({
          url: "/pages/login/index?f=ucenter",
        })
      }
    }
  },
  unbindWeChat: function () {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定要解除绑定？',
      success: function (res) {
        if (res.confirm) {
          if (app.globalData.token != "") {
            wx.login({
              success: wxres => {
                console.log(wxres.code);
                if (wxres.code) {
                  util.request(api.UserUnbindWeChat, {
                    wxcode: wxres.code,
                  }, 'POST').then(function (res) {
                    console.log(res);
                    if (res.errno == 0) {
                      app.globalData.userInfo.bindWeChat = false;
                      app.globalData.userInfo.OpenUserNickName = "";
                      app.globalData.userInfo.avatar = "/images/defuserhead.png";
                      wx.showToast({
                        title: '解绑成功',
                      });
                      wx.setStorageSync('autologin', "0");
                      that.onLoad()//重新执行下onLoad去获取当前的数据
                    }
                    else {
                      wx.showModal({
                        title: '解绑失败',
                        showCancel: false,
                        content: res.errMsg
                      });
                    }
                  });
                }
                else {
                  wx.showToast({
                    title: '获取微信code失败，请重试',
                    icon: 'none'
                  });
                }
              }
            });
          }
          else {
            wx.navigateTo({
              url: "/pages/login/index?f=ucenter",
            })
          }
        }
      }
    })
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