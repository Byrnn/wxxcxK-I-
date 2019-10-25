var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    ExistingAddresses:[],
    checkedAddress: {},
    CartInfomation: {},
    ShipmentInfoList: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    totalFreightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0, 
    arrow_down: "/static/images/arrow_down.png",
    address_right: "/static/images/address_right.png",
    arrIsOpenDelivery: [],
    arrIsOpenShipCom: [],
    arrWarehouseId: [],
    arrDeliverySelectedId: [],
    arrDeliverySelectedName: [],
    arrShipComSelectedId: [],
    arrShipComSelectedName: [],
    arrFreightPrice: [],
    arrFreightErrInfo: [],
    PurchaseOrder:"",
    OrderNotes:"",
    totalPriceIncludFreight:0
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    if (options.addressId) {
      this.setData({
        addressId: options.addressId
      });
    }

    /*try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }

      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }*/


  },
  getCheckoutInfo: function () {
    let that = this;
    util.request(api.CartCheckout, { addressId: that.data.addressId}).then(function (res) {
      if (res.errno === 0) {
        //console.log(res.data);
        var myCheckedAddress = null;
        if (res.CheckModel.ExistingAddresses.length>0)
        {
          for (var i = 0; i < res.CheckModel.ExistingAddresses.length;i++){
            if (res.CheckModel.ExistingAddresses[i].blCurrentSelected)
            {
              myCheckedAddress = res.CheckModel.ExistingAddresses[i];
              break;
            }
          }
        }
        if (myCheckedAddress == null && res.CheckModel.ExistingAddresses.length > 0)
        {
          myCheckedAddress = res.CheckModel.ExistingAddresses[0];
        }
        var myCheckedAddressId=0;
        if (myCheckedAddress!=null)
        {
          myCheckedAddressId = myCheckedAddress.Id;
        }
        var shipmentInfoLength = res.CheckModel.ShipmentInfoList.length;
        var arrWarehouseId = new Array(shipmentInfoLength);
        var arrDeliverySelectedId = new Array(shipmentInfoLength);
        var arrDeliverySelectedName = new Array(shipmentInfoLength);
        var arrShipComSelectedId = new Array(shipmentInfoLength);
        var arrShipComSelectedName = new Array(shipmentInfoLength);
        var arrFreightPrice = new Array(shipmentInfoLength);
        var arrFreightErrInfo = new Array(shipmentInfoLength);
        var arrIsOpenDelivery = new Array(shipmentInfoLength);
        var arrIsOpenShipCom = new Array(shipmentInfoLength);
        var totalFreightPrice = 0;
        if (shipmentInfoLength>0)
        {
          for (var i = 0; i < shipmentInfoLength;i++)
          {
            arrIsOpenDelivery[i] = false;
            arrIsOpenShipCom[i] = false;
            arrDeliverySelectedId[i] = res.CheckModel.ShipmentInfoList[i].DeliveryPayType;
            if (res.CheckModel.ShipmentInfoList[i].DeliveryPayType>0)
            {
              for (var j = 0; j < res.CheckModel.ShipmentInfoList[i].DeliveryPayTypeList.length;j++)
              {
                if (arrDeliverySelectedId[i] == res.CheckModel.ShipmentInfoList[i].DeliveryPayTypeList[j].Id)
                {
                  arrDeliverySelectedName[i] = res.CheckModel.ShipmentInfoList[i].DeliveryPayTypeList[j].Name;
                  break;
                }
              }
            }
            //console.log("arrDeliverySelectedName[" + i + "]=" + arrDeliverySelectedName[i]);
            if (arrDeliverySelectedName[i] == null || arrDeliverySelectedName[i] == "undefined" || arrDeliverySelectedName[i] == "") {
              arrDeliverySelectedName[i] = "--请选择--";
            }
            arrShipComSelectedId[i] = res.CheckModel.ShipmentInfoList[i].DefaultShippingCompanyId;
            if (res.CheckModel.ShipmentInfoList[i].DefaultShippingCompanyId > 0) {
              for (var j = 0; j < res.CheckModel.ShipmentInfoList[i].ShippingCompanyList.length; j++) {
                if (arrShipComSelectedId[i] == res.CheckModel.ShipmentInfoList[i].ShippingCompanyList[j].Id) {
                  arrShipComSelectedName[i] = res.CheckModel.ShipmentInfoList[i].ShippingCompanyList[j].Name;
                  break;
                }
              } 
            }
            if (arrShipComSelectedName[i] == null || arrShipComSelectedName[i] == "undefined"|| arrShipComSelectedName[i] == "") {
              arrShipComSelectedName[i] = "--请选择--";
            }

            arrWarehouseId[i] = res.CheckModel.ShipmentInfoList[i].WarehouseId;
            if (res.CheckModel.ShipmentInfoList[i].strFreight != null && res.CheckModel.ShipmentInfoList[i].strFreight != "undefined" && res.CheckModel.ShipmentInfoList[i].strFreight != "")
            {
              arrFreightPrice[i] = parseFloat(res.CheckModel.ShipmentInfoList[i].strFreight);
              totalFreightPrice += arrFreightPrice[i];
            }
            else{
              arrFreightPrice[i] = 0;
            }
          }
        }
        var totalPriceIncludFreight = res.CheckModel.CartInfomation.TotalPrice + totalFreightPrice;
        totalPriceIncludFreight = totalPriceIncludFreight.toFixed(2); 
        that.setData({
          checkedGoodsList: res.CheckModel.ShoppingCartSmallModelList,
          checkedAddress: myCheckedAddress,
          addressId: myCheckedAddressId,
          CartInfomation: res.CheckModel.CartInfomation,
          ExistingAddresses: res.CheckModel.ExistingAddresses,
          ShipmentInfoList: res.CheckModel.ShipmentInfoList,
          /*actualPrice: res.CheckModel.CartInfomation.TotalPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,*/
          goodsTotalPrice: res.CheckModel.CartInfomation.TotalPrice,
          orderTotalPrice: res.CheckModel.CartInfomation.TotalPrice,
          arrDeliverySelectedId: arrDeliverySelectedId,
          arrDeliverySelectedName: arrDeliverySelectedName,
          arrShipComSelectedId: arrShipComSelectedId,
          arrShipComSelectedName: arrShipComSelectedName,
          arrFreightPrice: arrFreightPrice,
          totalFreightPrice: totalFreightPrice,
          arrWarehouseId: arrWarehouseId,
          totalPriceIncludFreight: totalPriceIncludFreight,
          arrIsOpenDelivery: arrIsOpenDelivery
        });
      }
      wx.hideLoading();
      console.log(that.data.checkedAddress);
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/ucenter/address/address?fromCheckout=1',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd?fromCheckout=1',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { iAddressId: this.data.addressId, arrWarehouseId: this.data.arrWarehouseId, arrDeliveryPayType: this.data.arrDeliverySelectedId, arrShipCompanyId: this.data.arrShipComSelectedId, PurchaseOrder: this.data.PurchaseOrder, Notes: this.data.OrderNotes}, 'POST').then(res => {
      if (res.errno === 0 && res.OrderInfo.length>0) {
        if (res.OrderInfo.length==1)
        {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '下单成功，订单编号：' + res.OrderInfo[0].OrderId, 
            success: function (conshow) {
              if (conshow.confirm) {
                wx.redirectTo({
                  url: '/pages/ucenter/orderDetail/orderDetail?id=' + res.OrderInfo[0].OrderId
                });
              }
            }
          });
        }
        else{
          var orderids = "";
          for (var i = 0; i < res.OrderInfo.length;i++)
          {
            if(i>0)
            {
              orderids+=", ";
            }
            orderids += res.OrderInfo[i].OrderId + "(" + res.OrderInfo[i].OrderType+")";
          }
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '下单成功，订单被拆分为以下几个: ' + orderids,
            success: function (conshow) {
              if (conshow.confirm) {
                wx.redirectTo({
                  url: '/pages/ucenter/order/order'
                });
              }
            }
          });
        }
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '下单失败。' + res.errMsg
        });
      }
    });
  },
  openDeliverySelect: function (e) {
    var index = e.currentTarget.dataset.item;
    let arrIsOpenDelivery = this.data.arrIsOpenDelivery;
    if (arrIsOpenDelivery[index]) {
      arrIsOpenDelivery[index] = false;
      this.setData({
        arrIsOpenDelivery: arrIsOpenDelivery,
      });
    }
    else {
      arrIsOpenDelivery[index] = true;
      this.setData({
        arrIsOpenDelivery: arrIsOpenDelivery,
      });
    }
  },
  onClickDeliveryPayTypeSelect: function (e) {
    var sindex = e.currentTarget.dataset.sindex;
    var payindex = e.currentTarget.dataset.payindex;
    let arrDeliverySelectedId = this.data.arrDeliverySelectedId;
    let arrIsOpenDelivery = this.data.arrIsOpenDelivery;
    let arrIsOpenShipCom = this.data.arrIsOpenDelivery;
    arrIsOpenDelivery[sindex] = false;
    arrIsOpenShipCom[sindex] = false;
    let arrDeliverySelectedName = this.data.arrDeliverySelectedName;
    let name = this.data.ShipmentInfoList[sindex].DeliveryPayTypeList[payindex].Name;
    var blChange = (arrDeliverySelectedId[sindex] != this.data.ShipmentInfoList[sindex].DeliveryPayTypeList[payindex].Id);
    if (blChange)
    {
      arrDeliverySelectedId[sindex] = this.data.ShipmentInfoList[sindex].DeliveryPayTypeList[payindex].Id;
      arrDeliverySelectedName[sindex] = name;
      
      let arrShipComSelectedId = this.data.arrShipComSelectedId;
      let arrShipComSelectedName = this.data.arrShipComSelectedName;
      console.log("arrDeliverySelectedId[sindex]=" + arrDeliverySelectedId[sindex] + " | " + (arrDeliverySelectedId[sindex] == 3));
      if (arrDeliverySelectedId[sindex] == 3){
        arrShipComSelectedId[sindex] = 0;
        arrShipComSelectedName[sindex] = "--请选择--";
      }

      this.setData({
        arrIsOpenDelivery: arrIsOpenDelivery,
        arrIsOpenShipCom: arrIsOpenShipCom,
        arrDeliverySelectedId: arrDeliverySelectedId,
        arrDeliverySelectedName: arrDeliverySelectedName,
        arrShipComSelectedId: arrShipComSelectedId,
        arrShipComSelectedName: arrShipComSelectedName
      });
      this.FunCalcFreight();
    } 
    else{
      this.setData({
        arrIsOpenDelivery: arrIsOpenDelivery,
        arrIsOpenShipCom: arrIsOpenShipCom,
      });
    }
  },
  openShippingCompanySelect: function (e) {
    var index = e.currentTarget.dataset.item;
    let arrIsOpenShipCom = this.data.arrIsOpenShipCom;
    if (arrIsOpenShipCom[index]) {
      arrIsOpenShipCom[index]=false;
      this.setData({
        arrIsOpenShipCom: arrIsOpenShipCom,
      });
    }
    else {
      arrIsOpenShipCom[index] = true;
      this.setData({
        arrIsOpenShipCom: arrIsOpenShipCom,
      });
    }
  },
  onClickShippingCompanySelect: function (e) {
    var sindex = e.currentTarget.dataset.sindex;
    var shipcomindex = e.currentTarget.dataset.shipcomindex;
    let arrShipComSelectedId = this.data.arrShipComSelectedId;
    let arrShipComSelectedName = this.data.arrShipComSelectedName;
    let arrIsOpenShipCom = this.data.arrIsOpenShipCom;
    arrIsOpenShipCom[sindex]=false;
    console.log("sindex=" + sindex + ", shipcomindex=" + shipcomindex);
    let name = this.data.ShipmentInfoList[sindex].ShippingCompanyList[shipcomindex].Name;
    var blChange = (arrShipComSelectedId[sindex] != this.data.ShipmentInfoList[sindex].ShippingCompanyList[shipcomindex].Id);
    if (blChange) {
      arrShipComSelectedId[sindex] = this.data.ShipmentInfoList[sindex].ShippingCompanyList[shipcomindex].Id;
      arrShipComSelectedName[sindex] = name;
      console.log("id=" + arrShipComSelectedId[sindex] + ", name=" + name);
      this.setData({
        arrIsOpenShipCom: arrIsOpenShipCom,
        arrShipComSelectedId: arrShipComSelectedId,
        arrShipComSelectedName: arrShipComSelectedName
      });

      this.FunCalcFreight();
    } else {
      this.setData({
        arrIsOpenShipCom: arrIsOpenShipCom,
      });
    }
  },
  FunCalcFreight: function (){
    let that = this;
    if (that.data.addressId>0)
    {
      console.log(that.data.arrWarehouseId);
      console.log(that.data.arrShipComSelectedId);
      wx.showLoading({
        title: '获取运费...',
      });
      util.request(api.CalFreight, { iAddressId: that.data.addressId, arrWarehouseId: that.data.arrWarehouseId, arrShipCompanyId: that.data.arrShipComSelectedId }, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.errno === 0) {
        if (that.data.arrFreightPrice.length == res.arrFreight.length)
        {
          var totalFreightPrice = 0;
          for (var i = 0; i < res.arrFreight.length;i++)
          {
            totalFreightPrice += res.arrFreight[i];
          }
          var totalPriceIncludFreight = that.data.CartInfomation.TotalPrice + totalFreightPrice;
          totalPriceIncludFreight = totalPriceIncludFreight.toFixed(2); 
          that.setData({
            arrFreightPrice: res.arrFreight,
            totalFreightPrice: totalFreightPrice,
            arrFreightErrInfo: res.arrErrorItem,
            totalPriceIncludFreight: totalPriceIncludFreight
          });
        }
      }
      else {
        util.showNomalToast(res.errMsg);
      }
    });
    }
  }, 
  bindinputPurchaseOrder(event) {
    var PurchaseOrder = event.detail.value;
    this.setData({
      PurchaseOrder: PurchaseOrder
    });
  },
  bindinputOrderNotes(event) {
    var OrderNotes = event.detail.value;
    this.setData({
      OrderNotes: OrderNotes
    });
  },
})