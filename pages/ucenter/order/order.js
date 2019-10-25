var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: [],
    loadText: '数据请求中',
    disabled:true,
    pageindex:1,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.getOrderList();
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList, { p: that.data.pageindex }, null, null, true).then(function (res) {
      if (res.errno === 0) {
        console.log(res.OrderPageInfo);
        console.log(res.OrderList);
        var pageindex = that.data.pageindex + 1;
        that.setData({
          orderList: res.OrderList,
          pageindex: pageindex,
          loadText: '加载更多',
          disabled: false
        });
      }
    });
  },
  payOrder(){
    wx.redirectTo({
      url: '/pages/pay/pay',
    })
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
  setLoading(e) {
    //点击 加载更多 按钮
    let _this = this;
    let _page = this;

    // 暂存数据
    let oldOrderList = _this.data.orderList;

    util.request(api.OrderList, { p: _this.data.pageindex }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.OrderPageInfo);
        console.log(res.OrderList);
        let newdata = res.OrderList;
        if (newdata.length==0)
        {
          wx.showToast({
            title: '没有更多数据了!~',
            icon: 'none'
          })

          _this.setData({
            disabled:true,
            loadText:'我是有底线的~'
          });
        }
        else {
          wx.showToast({
            title: '数据加载中...',
            icon: 'none'
          })
          var pageindex = _this.data.pageindex+1;
          _page.setData({
            loadText: "数据请求中",
            loading: true,
            orderList: oldOrderList.concat(newdata),
            loadText: "加载更多",
            loading: false,
            pageindex: pageindex,
          });


          /*that.setData({
            orderList: res.OrderList,
            pageindex: pageindex
          });*/
        }
      }
    });
  }
})