const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

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
    inputOldPassword: '',
    inputNewPassword: '',
    inputCheckNewPassword: '',
    
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
  bindinputOldPassword:function(e){
   var value  = e.detail.value;
   this.setData({
     inputOldPassword: value     
   });
  },
  bindinputNewPassword: function (e) {
    var value = e.detail.value;
    this.setData({
      inputNewPassword: value
    });
  },
  bindinputCheckNewPassword: function (e) {
    var value = e.detail.value;
    this.setData({
      inputCheckNewPassword: value
    });
  },
  submitChangePwd: function (param) {
    var that = this;
    if (that.data.inputOldPassword=="") {
      util.showErrorToast('请填写旧密码');
      return false;
    }
    else if (that.data.inputNewPassword == "") {
      util.showErrorToast('请填写新密码');
      return false;
    }
    else if (that.data.inputNewPassword.length < 6 || that.data.inputNewPassword.length>20) {
      util.showErrorToast('密码长度为6-20位');
      return false;
    }
    else if (that.data.inputNewPassword != that.data.inputCheckNewPassword) {
      util.showErrorToast('两次密码不一致');
      return false;
    }
    else if (that.data.inputOldPassword == that.data.inputNewPassword) {
      util.showErrorToast('新旧密码不能一样');
      return false;
    }
    util.request(api.ChangePassword, {
      OldPassword: that.data.inputOldPassword,
      NewPassword: that.data.inputNewPassword,
    }, 'POST',null,true).then(function (res) {
      if (res.errno === 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '密码已更新', 
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/ucenter/index/index'
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