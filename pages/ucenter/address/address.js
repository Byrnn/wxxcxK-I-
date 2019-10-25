var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
    fromCheckout:false,
    noAddress: api.WebRootUrl + "images/WeChatApplet/noAddress.png",
    editAddress: api.WebRootUrl + "images/WeChatApplet/address-edit.png"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    if (options.fromCheckout) {
      this.setData({
        fromCheckout: (options.fromCheckout =="true" || options.fromCheckout == "1")
      });
    }
    this.getAddressList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

  },
  getAddressList (){
    let that = this;
    util.request(api.AddressList, null, null, that, true).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          addressList: res.AddressList
        });
      } 
    });
  },
  selectAddress(event) {
    console.log(event)
    if (this.data.fromCheckout)
    {
      wx.navigateTo({
        url: '/pages/shopping/checkout/checkout?addressId=' + event.currentTarget.dataset.addressId
      })
    }
    
  },
  addressAddOrUpdate (event) {
    console.log(event)
    let that = this;
    wx.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId + '&fromCheckout=' + that.data.fromCheckout
    })
  },
  deleteAddress(event){
    console.log(event.target)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          util.request(api.AddressDelete, { id: addressId }, 'POST', null,true).then(function (res) {
            if (res.errno === 0) {
              util.showNomalToast('已删除');
              that.getAddressList();
            }
            else {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.errMsg
              });
            }
          });
          console.log('用户点击确定')
        }
      }
    })
    return false;
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})