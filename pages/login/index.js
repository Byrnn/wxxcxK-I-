const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();
Page({
  data:{
    loginBtnTxt:"登录",
    loginBtnBgBgColor:"#51805c",
    btnLoading:false,
    disabled:false,
    inputUserName: '',
    inputPassword: '',
    frompage:'/pages/ucenter/index/index'
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    if (options && options.frompage && options.frompage != "" && options.frompage != "undefined") {
      this.data.frompage = "/" + options.frompage;
    }
    else if (api.loginToUrl && api.loginToUrl != "undefined" && api.loginToUrl!="")
    {
      this.data.frompage = api.loginToUrl;
    }
    var autologin = wx.getStorageSync('autologin');
    console.log("autologin=" + autologin+" | login page token=" + app.globalData.token + " | frompage=" + this.data.frompage);
    if (autologin=="" || autologin=="1")
    {
      var that = this;
      wx.login({
        success: wxres => {
          console.log(wxres.code);
          if (wxres.code) {
            util.request(api.QuickLogin, {
              wxcode: wxres.code,
            }, 'POST', null, true).then(function (res) {
              console.log(res);
              if (res.errno == 0) {
                util.showNomalToast('自动登录成功');
                app.globalData.userInfo = res.UserInfo;
                app.globalData.token = res.UserInfo.SessionToken;
                //存储用户信息
                wx.setStorageSync('userInfo', app.globalData.userInfo);
                wx.setStorageSync('token', app.globalData.token); 
                wx.setStorageSync('reloadindex', "1");
                api.loginToUrl = "";
                wx.getUserInfo({
                  success: function (wxuserinfo) {
                    //console.log("success wxuserinfo");
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
                        wx.switchTab({
                          url: that.data.frompage,
                        })
                      }
                      else {
                        wx.showModal({
                          title: '提示',
                          showCancel: false,
                          content: saveRes.errMsg
                        });
                      }
                    });
                  },
                  fail:function(failinfo)
                  {
                    //console.log("failinfo");
                    //console.log(failinfo);
                    if (res.UserInfo.bindWeChat)
                    {
                      app.globalData.userInfo.OpenUserNickName = res.UserInfo.OpenUserNickName
                      app.globalData.userInfo.avatar = res.UserInfo.avatar
                    }
                    wx.switchTab({
                      url: that.data.frompage,
                    });
                  }
                });
              }
              else {
                util.showNomalToast(res.errMsg);
                wx.setStorageSync('autologin', "0");
              }
            });
          }
          else {
            wx.showToast({
              title: '获取微信code失败',
              icon: 'none'
            });
          }
        }
      });
    }

  },
  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  },
  submitLogin() {
    if (this.data.inputUserName == '') {
      util.showErrorToast('请输入登录邮箱');
      return false;
    }

    if (this.data.inputPassword == '') {
      util.showErrorToast('请输入密码');
      return false;
    }
    wx.showLoading({
      title: '正在登录...',
    });
    var that = this;
    util.request(api.UserLogin, {
      Username: that.data.inputUserName,
      Password: that.data.inputPassword,
    }, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        util.showNomalToast('登录成功');
        app.globalData.userInfo = res.UserInfo;
        app.globalData.token = res.UserInfo.SessionToken;
        //存储用户信息
        wx.setStorageSync('userInfo', app.globalData.userInfo);
        wx.setStorageSync('token', app.globalData.token); 
        wx.setStorageSync('autologin', "1");
        wx.setStorageSync('reloadindex', "1");
        api.loginToUrl = "";
        wx.switchTab({
          url: that.data.frompage,
        })
      }
      else{
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.errMsg
        });
        return false;
      }
    });

  },
  setLoginData1:function(){
    this.setData({
      loginBtnTxt:"登录中",
      disabled: !this.data.disabled,
      loginBtnBgBgColor:"#999",
      btnLoading:!this.data.btnLoading
    });
  },
  setLoginData2:function(){
    this.setData({
      loginBtnTxt:"登录",
      disabled: !this.data.disabled,
      loginBtnBgBgColor:"#ff9900",
      btnLoading:!this.data.btnLoading
    });
  },
  checkUserName:function(param){
    var email = util.regexConfig().email; 
    var phone = util.regexConfig().phone;
    var inputUserName = param.username.trim();
    if(email.test(inputUserName)||phone.test(inputUserName)){
      return true;
    }else{
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '请输入正确的邮箱'
      });
      return false;
    }
  },
  checkPassword:function(param){
    var userName = param.username.trim();
    var password = param.password.trim();
    if(password.length<=0){
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '请输入密码'
      });
      return false;
    }else{
      return true;
    }
  },
  redirectTo:function(param){
    //需要将param转换为字符串
    param = JSON.stringify(param);
    wx.redirectTo({
      url: '../main/index?param='+ param//参数只能是字符串形式，不能为json对象
    })
  },

  bindinputUsername(event) {
    this.setData({
      inputUserName: event.detail.value
    });
  },
  bindinputPassword(event) {
    this.setData({
      inputPassword: event.detail.value
    });
  },
  tapForgotPassword: function ()
  {
    wx.redirectTo({
      url: '/pages/findpassword/index'
    });
  },
  tapRegister: function () {
    wx.redirectTo({
      url: '/pages/regist/index'
    });
  },
  tapGoHomePage: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
})