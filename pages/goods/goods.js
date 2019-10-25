var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    id: 0,
    colorid:0,
    defpiclist:[],
    colors:[],
    description:[],
    goods: [],
    price:[],
    size:[],
    propertys:[],
    selcolor:0,
    selpiccolor:0,
    selservice:0,
    totalprice:0,
    proqtylist:[],
    impid:0,
    impitemid:0,
    imp:[],
    lstPrice:[],
    lstDiscount:[],
    totalqty:0,
    qtyincart:0,
    seltab:0,
    warehouse:[],
    selwarehouse:0,
    warehouseviewonly:true,
    islogin:false,

    gallery: [],
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png"
  },
  getGoodsInfo: function () {
    let that = this;
    util.request(api.GoodsDetail, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          defpiclist:res.data.picList,
          colors:res.data.colors,
          description: res.data.description,
          goods: res.data.info,
          price:res.data.price,
          size: res.data.sizeDetials,
          propertys: res.data.PropertyColorList,
          selcolor: res.data.colors.length > 0 ? res.data.colors[0].id:0,
          selpiccolor:0,
          proqtylist: res.data.proqtylist,
          cartGoodsCount: res.data.cartGoodsCount,
          selservice: res.data.price.ServicePriceList.length > 0 ? res.data.price.ServicePriceList[0].Id:0,
          imp: res.data.ImprintModel,
          lstPrice:res.data.pricedata,
          lstDiscount:res.data.discountdata,
          qtyincart: res.data.qtyincart,
          warehouse:res.data.warehouse,
          selwarehouse:res.data.warehouse.length>0?res.data.warehouse[0].id:0,
          warehouseviewonly: res.data.warehouse.length > 0 ? res.data.warehouse[0].viewonly : true,
          islogin:res.data.isLogin,

          gallery: res.data.gallery,
          attribute: res.data.attribute,
          issueList: res.data.issue,
          comment: res.data.comment,
          brand: res.data.brand,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          userHasCollect: res.data.userHasCollect
        });

        if (res.data.userHasCollect == 1) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          });
        }

        WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);

        that.getGoodsRelated();
      }
    });

  },
  getGoodsRelated: function () {
    let that = this;
    util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },
  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].specification_id == specNameId) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
            } else {
              _specificationList[i].valueList[j].checked = true;
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].specification_id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });

    return checkedValue.join('_');
  },
  changeSpecInfo: function () {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }

  },
  getCheckedProductItem: function (key) {
    return this.data.productList.filter(function (v) {
      if (v.goods_specification_ids == key) {
        return true;
      } else {
        return false;
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id)
      // id: 1181000
    });
    var that = this;
    this.getGoodsInfo();
    util.request(api.CartGoodsCount).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          cartGoodsCount: res.data.cartTotal.goodsCount
        });

      }
    });
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr
      });
    }
  },
  closeAttr: function () {
    this.setData({
      openAttr: false,
    });
  },
  tabchange:function(e){
    this.setData({
      seltab: e.currentTarget.dataset.id,
    });
  },
  addCannelCollect: function () {
    let that = this;
    //添加或是取消收藏
    util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST")
      .then(function (res) {
        let _res = res;
        if (_res.errno == 0) {
          if (_res.data.type == 'add') {
            that.setData({
              'collectBackImage': that.data.hasCollectImage
            });
          } else {
            that.setData({
              'collectBackImage': that.data.noCollectImage
            });
          }

        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
            mask: true
          });
        }
      });
  },
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },
  addToCart: function () {
    var that = this;
    if (!that.data.islogin) {
      wx.switchTab({
        url: '/pages/cart/cart',
      });
      return;
    }
    if (that.data.warehouseviewonly){
      wx.showToast({
        title: '当前仓库仅允许查看库存',
        icon: "none"
      });
      return;
    }
    if (this.data.totalqty<=0){//(this.data.openAttr === false) {
      wx.showToast({
        title: '请选择产品数量',
        icon:"none"
      });
      /*//打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });*/
    } else {
/*
      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '请选择规格',
          mask: true
        });
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProduct || checkedProduct.length <= 0) {
        //找不到对应的product信息，提示没有库存
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '库存不足',
          mask: true
        });
        return false;
      }

      //验证库存
      if (checkedProduct.goods_number < this.data.number) {
        //找不到对应的product信息，提示没有库存
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '库存不足',
          mask: true
        });
        return false;
      }
*/
      var prostr ="";
      for (var i = 0; i < this.data.proqtylist.length;i++){
        if (this.data.proqtylist[i].qty>0)
        {
          prostr += this.data.proqtylist[i].id + ":" + this.data.proqtylist[i].qty+",";
        }
      }
      console.log("prostr:" + prostr);
      //添加到购物车
      util.request(api.CartAdd, { productid: this.data.id, "prostr": prostr,
      "selwarehouse":this.data.selwarehouse }, "POST")
        .then(function (res) {
          let _res = res;
          if (_res.errno == 0) {
            wx.showToast({
              title: '添加成功'
            });
            that.setData({
              openAttr: !that.data.openAttr,
              cartGoodsCount: _res.data.cartTotal.goodsCount
            });
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });
    }

  },
  //选择颜色
  PriceColorChange: function (e) {
    this.setData({
      selcolor: e.detail.value
    });
  },
  //选择服务
  PriceServiceChange: function (e) {
    this.setData({
      selservice: e.detail.value
    });
    //计算总价
    this.CalculateTotal();
  },
  //选择印刷方式
  PriceImpChange: function (e) {
    this.setData({
      impid: e.detail.value
    });
    //计算总价
    this.CalculateTotal();
  },
  //选购数量变更
  qtyChange: function (e) {
    var qty = +e.detail.value;
    var stock = +e.currentTarget.dataset.stock;
    var pid = e.currentTarget.dataset.pid;
    if (isNaN(+qty)|| +qty<0)
    {
      qty=0;
    }
    else{
      for(var i=0;i< this.data.proqtylist.length;i++){
        if (this.data.proqtylist[i].id==pid){
          this.data.proqtylist[i].qty=qty;
        }
      }
    }
    var qtycount=0;
    for (var i = 0; i < this.data.proqtylist.length; i++) {
      qtycount += +this.data.proqtylist[i].qty;
    }
    this.setData({
      totalqty:qtycount
    });
    //计算总价
    this.CalculateTotal();
  },
  //选择图片颜色
  switchcolorpic: function (event) {
    this.setData({
      selpiccolor: event.currentTarget.dataset.id
    });
  },
  CalculateTotal: function () {
    var lstPerQty=this.data.proqtylist;
    var iCalTotalQty = this.data.totalqty;
    var iService=this.data.selservice;
    var iImprintId = this.data.impid;
    var iImprintSubId=this.data.impitemid;
    var isSample=false;
    var PositionImpId=0;

    var deSampleFree=0;

    var iSearchQty = iCalTotalQty + this.data.qtyincart;
    var result = {
      "ErrMsg": "Error! Price or quantities are not correct, please try again.", "Total": 0, "Saving": 0,
      "MinDiscount": 0, "MaxDiscount": 0, "SurplusSample": 0
    };
    var deTotal = 0, deSaving = 0;
    if (lstPerQty != null && lstPerQty.length > 0) {
      var strErrMsg = "";
      var deNowSampleFree = deSampleFree;
      var iIndex = 0;
      for (var iPerIndex = 0; iPerIndex < lstPerQty.length; iPerIndex++) {
        var per=lstPerQty[iPerIndex];
        var subresult = null;
        if (isSample) {
          //subresult = CalculateSample(per.id, deNowSampleFree, per.qty, iService);
          deNowSampleFree = subresult.SampleFree;
        }
        else
          subresult = this.Calculate(per.id, per.qty, iCalTotalQty, iService, iImprintId, iImprintSubId, PositionImpId);
        deNowSampleFree = subresult.SurplusSample;
        deTotal += subresult.Total;
        deSaving += subresult.Saving;
        if (iIndex == 0) {
          result.MaxDiscount = subresult.Discount;
          result.MinDiscount = subresult.Discount;
        }
        //记录最大最小折扣
        if (subresult.Discount > result.MaxDiscount)
          result.MaxDiscount = subresult.Discount;
        if (subresult.Discount < result.MinDiscount)
          result.MinDiscount = subresult.Discount;

        if (subresult.ErrMsg != "")
          strErrMsg = subresult.ErrMsg;
        iIndex++;
      }
      deTotal=this.Round(deTotal);
      result.ErrMsg = strErrMsg;
      result.Total = deTotal;
      result.Saving = deSaving;
      result.SurplusSample = deNowSampleFree;
    }
    this.setData({
      totalprice: deTotal
    });
  },
  //计算单项价格
  Calculate: function (iPropertyId, iQty, iCalTotalQty, iService, iImprintId, iImprintSubId, PositionImpId) {
    var deRebateCount=0;
    var iSearchQty = iCalTotalQty + this.data.qtyincart;
    var result = {
      "ErrMsg": "Error! Price or quantities are not correct, please try again.", "UnitPrice": 0, "SamplePrice": 0, "Total": 0,
      "Saving": 0, "Discount": 0, "SurplusSample": 0
    };
    var lstPrice = this.data.lstPrice;
    var lstDiscount = this.data.lstDiscount;
    if (lstPrice != null && lstPrice.length > 0) {
      var sub = null;
      //search price
      for (var pIndex = 0; pIndex < lstPrice.length; pIndex++) {
        var p = lstPrice[pIndex];
        if (p.Service == iService &&
          (iImprintId == null || p.ImprintId == iImprintId || iImprintId == "")) {
          //search items
          for (var iIndex = 0; iIndex < p.Items.length; iIndex++) {
            var i = p.Items[iIndex];
            var hasProperty = false;
            if (iImprintSubId == null || iImprintSubId == ""
              || (iImprintSubId == i.Id || 
              i.pImpId == PositionImpId && PositionImpId >= 0)) {
              //propertys check
              for (var perIndex = 0; perIndex < i.Propertys.length; perIndex++) {
                var per = i.Propertys[perIndex];
                if (per == iPropertyId) {
                  hasProperty = true;
                }
              }
              if (hasProperty) {
                for(var sIndex=0;sIndex< i.Subs.length;sIndex++) {
                  var s=i.Subs[sIndex];
                  if (iSearchQty >= s.Qty && s.UnitPrice > 0)// && !s.isPoa)
                    sub = s;
                }
              }
              //Found, return
              if (sub != null)
                break;
            }
          }
          //Found, return
          if (sub != null)
            break;
        }
      }
      if (sub != null) {
        if (sub.isPoa) {
          result.ErrMsg = "Sorry! Price is not acceptable!";
        } else {
          //search discount
          var deDiscount = 0;
          if (lstDiscount != null && lstDiscount.length > 0) {
            for(var dIndex=0;dIndex< lstDiscount.length;dIndex++) {
              var d=lstDiscount[dIndex];
              var hasProperty = false;
              //propertys check
              for(var perIndex=0;perIndex< d.Propertys.length;perIndex++) {
                var per=d.Propertys[perIndex];
                if (per == iPropertyId) {
                  hasProperty = true;
                  break;
                }
              }
              if (hasProperty) {
                deDiscount = d.Discount;
                break;
              }
            }
          }
          //实际折扣按产品折扣与返利折扣合并计算
          var deCalDiscount = deDiscount + deRebateCount;

          result.UnitPrice = sub.UnitPrice;
          result.Discount = 0;
          //Math.round(253.2658745*100)/100=253.27
          var Total = this.Round(sub.UnitPrice * iQty);
          //calculate discount
          if (deCalDiscount > 0 && deCalDiscount < 1) {
            var DiscountTotal = this.Round(Total * (1 - deCalDiscount));
            result.Saving = this.Round(Total - DiscountTotal);
            Total = DiscountTotal;
            result.Discount = deDiscount * 100;
          }
          result.Total = Total;
          result.ErrMsg = "";
        }
      }
    }
    return result;
  },
  warehouseChange: function (e) {
    var viewonly=true;
    for(var i=0;i<this.data.warehouse.length;i++){
      if (this.data.warehouse[i].id==+e.detail.value){
        viewonly=this.data.warehouse[i].viewonly;
      }
    }
    this.setData({
      selwarehouse: e.detail.value,
      warehouseviewonly: viewonly,
    });
  },
  Round:function(num){
    return Math.round(num * 100) / 100;
  }
})