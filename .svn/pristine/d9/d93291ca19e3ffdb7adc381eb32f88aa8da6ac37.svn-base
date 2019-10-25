var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();

Page({
  data: {
    cartGoods: [],
    CurrencySymbol: '',
    RebateDiscount: 0,
    TotalAmount: 0,
    TotalDiscountPrice: 0,
    TotalPrice: 0,
    TotalSavingPrice: 0,
    /*cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    editCartList: [],*/
    checkedGoodsCount:0,
    isEditCart: false,
    checkedAllStatus: true,
    noCart: api.WebRootUrl + "images/WeChatApplet/noCart.png",
    blLogion: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    var blLogion = app.globalData.token != "";

    this.setData({
      blLogion: blLogion,
    });

    if (!blLogion) {
      wx.navigateTo({
        url: "/pages/login/index?frompage=pages/cart/cart",
      });
    }
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    var blLogion = app.globalData.token != "";
    console.log("blLogion=" + blLogion + "|app.globalData.token=" + app.globalData.token);
    this.setData({
      blLogion: blLogion,
    });
    if (blLogion){
      this.getCartList();
    }
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  getCartList: function () {
    let that = this;
    util.request(api.CartList,null,null,that).then(function (res) {
      if (res.errno === 0) {
        //console.log(res.data);
        that.setData({
          cartGoods: res.shoppingCartModel.Items,
          CurrencySymbol: res.shoppingCartModel.CurrencySymbol,
          RebateDiscount: res.shoppingCartModel.RebateDiscount,
          TotalAmount: res.shoppingCartModel.TotalAmount,
          TotalDiscountPrice: res.shoppingCartModel.TotalDiscountPrice,
          TotalPrice: res.shoppingCartModel.TotalPrice,
          TotalSavingPrice: res.shoppingCartModel.TotalSavingPrice
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll(),
        checkedGoodsCount: that.getCheckedGoodsCount()
      });
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.isWantToCheckOut == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;

    if (!this.data.isEditCart) {
      util.request(api.CartChecked, { Ids: that.data.cartGoods[itemIndex].Id, isChecked: !that.data.cartGoods[itemIndex].isWantToCheckOut}, 'POST').then(function (res) {
        if (res.errno === 0) {
          that.setData({
            cartGoods: res.shoppingCartModel.Items,
            CurrencySymbol: res.shoppingCartModel.CurrencySymbol,
            RebateDiscount: res.shoppingCartModel.RebateDiscount,
            TotalAmount: res.shoppingCartModel.TotalAmount,
            TotalDiscountPrice: res.shoppingCartModel.TotalDiscountPrice,
            TotalPrice: res.shoppingCartModel.TotalPrice,
            TotalSavingPrice: res.shoppingCartModel.TotalSavingPrice
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll(),
          checkedGoodsCount: that.getCheckedGoodsCount()
        });
      });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex){
          element.isWantToCheckOut = !element.isWantToCheckOut;
        }
        
        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        checkedGoodsCount: that.getCheckedGoodsCount()
      });
    }
  },
  getCheckedGoodsCount: function(){
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.isWantToCheckOut === true) {
        checkedGoodsCount += v.Quantity;
      }
    });
    console.log("checkedGoodsCount="+checkedGoodsCount);
    return checkedGoodsCount;
  },
  checkedAll: function () {
    let that = this;

    if (!this.data.isEditCart) {
      var Ids = this.data.cartGoods.map(function (v) {
        return v.Id;
      });
      util.request(api.CartChecked, { Ids: Ids.join(','), isChecked: !that.isCheckedAll() }, 'POST').then(function (res) {
        if (res.errno === 0) {
          console.log(res.data);
          that.setData({
            cartGoods: res.shoppingCartModel.Items,
            CurrencySymbol: res.shoppingCartModel.CurrencySymbol,
            RebateDiscount: res.shoppingCartModel.RebateDiscount,
            TotalAmount: res.shoppingCartModel.TotalAmount,
            TotalDiscountPrice: res.shoppingCartModel.TotalDiscountPrice,
            TotalPrice: res.shoppingCartModel.TotalPrice,
            TotalSavingPrice: res.shoppingCartModel.TotalSavingPrice
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll(),
          checkedGoodsCount: that.getCheckedGoodsCount()
        });
      });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.isWantToCheckOut = !checkedAllStatus;
        return v;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        checkedGoodsCount: that.getCheckedGoodsCount()
      });
    }

  },
  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        checkedGoodsCount: that.getCheckedGoodsCount()
      });
    }

  },
  updateCart: function (Id, Quantity) {
    let that = this;

    util.request(api.CartUpdate, {
      Id: Id,
      Quantity: Quantity,
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          cartGoods: res.shoppingCartModel.Items,
          CurrencySymbol: res.shoppingCartModel.CurrencySymbol,
          RebateDiscount: res.shoppingCartModel.RebateDiscount,
          TotalAmount: res.shoppingCartModel.TotalAmount,
          TotalDiscountPrice: res.shoppingCartModel.TotalDiscountPrice,
          TotalPrice: res.shoppingCartModel.TotalPrice,
          TotalSavingPrice: res.shoppingCartModel.TotalSavingPrice
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll(),
        checkedGoodsCount: that.getCheckedGoodsCount()
      });
    });

  },
  bindinputNumber: function (e) {
    var value = e.detail.value;
    let itemIndex = e.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    //console.log("value=" + value + ", itemIndex=" + itemIndex);
    //console.log(cartItem);
    if (cartItem.CurrentStock>0)
    {
      if (value<1)
      {
        value=1;
        util.showErrorToast('数量必须大于0');
      }
      else if (value>cartItem.CurrentStock)
      {
        value = cartItem.CurrentStock;
        util.showErrorToast('数量超出当前库存');
      }
      else{
        cartItem.Quantity = value;
      }
    }
    else{
      value=0;
    }
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.Id, value);
  },
  cutNumber: function (event) {

    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    if (cartItem.Quantity>1)
    {
      let Quantity = cartItem.Quantity - 1;
      cartItem.Quantity = Quantity;
      this.setData({
        cartGoods: this.data.cartGoods
      });
      this.updateCart(cartItem.Id, Quantity);
    }
    else{
      util.showErrorToast('数量必须大于0');
    }
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    if (cartItem.Quantity < cartItem.CurrentStock)
    {
      let Quantity = cartItem.Quantity + 1;
      cartItem.Quantity = Quantity;
      this.setData({
        cartGoods: this.data.cartGoods
      });
      this.updateCart(cartItem.Id, Quantity);
    }
    else {
      util.showErrorToast('数量超出当前库存');
    }
  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;

    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.isWantToCheckOut == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }


    wx.navigateTo({
      url: '../shopping/checkout/checkout'
    })
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this;

    let Ids = this.data.cartGoods.filter(function (element, index, array) {
      if (element.isWantToCheckOut == true) {
        return true;
      } else {
        return false;
      }
    });

    if (Ids.length <= 0) {
      return false;
    }

    Ids = Ids.map(function (element, index, array) {
      if (element.isWantToCheckOut == true) {
        return element.Id;
      }
    });

    wx.showModal({
      title: '',
      content: '确定删除选中项？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.CartDelete, {
            Ids: Ids.join(',')
          }, 'POST', null, true).then(function (res) {
            if (res.errno === 0) {
              util.showNomalToast('已删除');
              that.setData({
                cartGoods: res.shoppingCartModel.Items,
                CurrencySymbol: res.shoppingCartModel.CurrencySymbol,
                RebateDiscount: res.shoppingCartModel.RebateDiscount,
                TotalAmount: res.shoppingCartModel.TotalAmount,
                TotalDiscountPrice: res.shoppingCartModel.TotalDiscountPrice,
                TotalPrice: res.shoppingCartModel.TotalPrice,
                TotalSavingPrice: res.shoppingCartModel.TotalSavingPrice
              });
            }
            else{
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.errMsg
              });
            }

            that.setData({
              checkedAllStatus: that.isCheckedAll(),
              checkedGoodsCount: that.getCheckedGoodsCount()
            });
          });
        }
      }
    })    
  },

  bindtapLogin: function () {
    wx.navigateTo({
      url: "/pages/login/index?frompage=pages/cart/cart",
    });
  },
})