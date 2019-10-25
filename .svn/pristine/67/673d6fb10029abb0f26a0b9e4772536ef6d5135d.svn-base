var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0,
    loadSuccess: false,
    selectedCategoryId:''
  },
  onLoad: function (options) {
    console.log(options)
    this.getCatalog();
  },
  getCatalog: function () {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CatalogList).then(function (res) {
      console.log("categoryList:" + res.categoryList.length);
        that.setData({
          navList: res.categoryList,
          currentCategory: res.currentCategory,
          loadSuccess: true
        });
        wx.hideLoading();
        if (wx.getStorageSync('catalogid') != "undefined" && wx.getStorageSync('catalogid') != "")
        {
          that.data.selectedCategoryId = wx.getStorageSync('catalogid');
          that.getCurrentCategory(that.data.selectedCategoryId);
          wx.setStorageSync('catalogid','');
        }
      });
      /*
    util.request(api.GoodsCount).then(function (res) {
      that.setData({
        goodsCount: res.goodsCount
      });
    });*/

  },
  getCurrentCategory: function (id) {
    let that = this;
    util.request(api.CatalogCurrent, { id: id })
      .then(function (res) {
        that.setData({
          currentCategory: res.currentCategory
        });
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    if (!this.data.loadSuccess)
    {
      this.getCatalog();
    }
    else if (wx.getStorageSync('catalogid') != this.data.selectedCategoryId)
    {
      this.data.selectedCategoryId = wx.getStorageSync('catalogid');
      this.getCurrentCategory(this.data.selectedCategoryId);
      wx.setStorageSync('catalogid', '');
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getList: function () {
    var that = this;
    util.request(api.ApiRootUrl + 'api/catalog/' + that.data.currentCategory.cat_id)
      .then(function (res) {
        that.setData({
          categoryList: res.data,
        });
      });
  },
  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }

    this.getCurrentCategory(event.currentTarget.dataset.id);
  }
})