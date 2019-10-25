const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
var app = getApp()
Page({
  data: {
    //goodsCount: 0,
    //newGoods: [],
    //hotGoods: [],
    //topics: [],
    //brands: [],
    //floorGoods: [],
    banner: [],
    channel: [],
    categoryList: [],
    loadSuccess: false,
  },
  onShareAppMessage: function () {
    return {
      title: '开逸服饰',
      desc: '开逸服饰',
      path: '/pages/index/index'
    }
  },

  getIndexData: function () {
    let that = this; 
    wx.showLoading({
      title: '首页加载中...',
    });
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          //newGoods: res.data.newGoodsList,
          //hotGoods: res.data.hotGoodsList,
          //topics: res.data.topicList,
          categoryList: res.categoryList,
          //floorGoods: res.data.categoryList,
          banner: res.banner,
          channel: res.channel,
          loadSuccess: true
        });
        wx.setStorageSync('reloadindex', "0");
      }
      else{        
        console.log(res.errMsg);
      }
      wx.hideLoading();
    });
  },
  onLoad: function (options) {
    this.getIndexData();
    /*util.request(api.GoodsCount).then(res => {
      this.setData({
        goodsCount: res.data.goodsCount
      });
    });*/
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log("loadSuccess=" + this.data.loadSuccess + " | reloadindex=" + wx.getStorageSync('reloadindex'))
    if (!this.data.loadSuccess || wx.getStorageSync('reloadindex') == "1")
    {
      this.getIndexData();
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onClickCatalog: function (e) {
    var id = e.currentTarget.dataset.key;
    wx.setStorageSync('catalogid', id);
    wx.switchTab({
      url: '/pages/catalog/catalog',
    })
  },
  
})
