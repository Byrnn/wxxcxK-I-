const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
  data:{
    registBtnTxt:"提交",
    registBtnBgBgColor:"#51805c",
    getSmsCodeBtnTxt:"获取验证码",
    getSmsCodeBtnColor:"#51805c",
    // getSmsCodeBtnTime:60,
    btnLoading:false,
    registDisabled:false,
    smsCodeDisabled:false,
    inputUserName: '',
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
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
  bindinputUsername:function(e){
   var value  = e.detail.value;
   this.setData({
     inputUserName: value     
   });
  },
  submitFindUsername: function (param) {
    var that = this;
    if (that.data.inputUserName=="") {
      util.showErrorToast('请填登录邮箱');
      return false;
    }
    wx.showLoading({
      title: '正在请求操作...',
    });
    util.request(api.ForgottenPassword, {
      LoginEmail: that.data.inputUserName,
    }, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.errno === 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '重置密码的邮件已发送至您的邮箱，请点击邮件提供的链接完成密码重置。', 
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/index'
              });
            };
          }
        });
        
      }
      else{
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.errMsg
        });
      }
      }); 
  },
})