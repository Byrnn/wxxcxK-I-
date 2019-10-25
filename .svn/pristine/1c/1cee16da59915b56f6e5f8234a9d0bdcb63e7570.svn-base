var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    address: {
      Id: 0,
      CountryId: 0,
      StateProvinceId: 0,
      CityId: 0,
      CountryName: '',
      State: '',
      City: '',
      Address1: '',
      ZipPostalCode: '',
      FirstName: '',
      Company: '',
      PhoneNumber: '',
      MobileNumber: '',
      FullRegion:'',
      blDefault: 0,
      fromCheckout:false
    },
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [
      { Id: 0, NameCn: '国家', parent_id: 0, type: 1 },
      { Id: 0, NameCn: '省份', parent_id: 0, type: 2 },
      { Id: 0, NameCn: '城市', parent_id: 0, type: 3 }
    ],
    regionType: 1,
    regionList: [],
    selectRegionDone: false
  },
  bindinputName(event) {
    let address = this.data.address;
    address.FirstName = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputMobile(event) {
    let address = this.data.address;
    address.MobileNumber = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputPhoneNumber(event) {
    let address = this.data.address;
    address.PhoneNumber = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputCompany(event) {
    let address = this.data.address;
    address.Company = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddress (event){
    let address = this.data.address;
    address.Address1 = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputZipPostalCode(event) {
    let address = this.data.address;
    address.ZipPostalCode = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindIsDefault(){
    let address = this.data.address;
    address.blDefault = !address.blDefault;
    this.setData({
      address: address
    });
  },
  getAddressDetail() {
    let that = this;
    util.request(api.AddressDetail, { Id: that.data.addressId }, null, null, true).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          address: res.Address
        });
      }
    });
  },
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      console.log("item.type=" + item.type + " | id=" + item.Id);
      if (item.type!=3)
      {
        return item.Id != 0;
      }
      else{
      return true;
      }
    });

    that.setData({
      selectRegionDone: doneStatus
    })

  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });

    //设置区域选择数据
    let address = this.data.address;
    console.log(address.CountryId + " | " + address.StateProvinceId + " | " +address.CityId);
    if (address.CountryId > 0 && address.StateProvinceId > 0 && address.CityId > 0) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].Id = address.CountryId;
      selectRegionList[0].NameCn = address.CountryName;
      selectRegionList[0].parent_id = 0;

      selectRegionList[1].Id = address.StateProvinceId;
      selectRegionList[1].NameCn = address.State;
      selectRegionList[1].parent_id = address.CountryId;

      selectRegionList[2].Id = address.CityId;
      selectRegionList[2].NameCn = address.City;
      selectRegionList[2].parent_id = address.StateProvinceId;

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });

      this.getCityList(address.StateProvinceId);
    } else {
      this.setData({
        selectRegionList: [
          { Id: 0, NameCn: '国家', parent_id: 0, type: 1 },
          { Id: 0, NameCn: '省份', parent_id: 0, type: 2 },
          { Id: 0, NameCn: '城市', parent_id: 0, type: 3 }
        ],
        regionType: 1
      })
      this.getCountryList();
    }

    this.setRegionDoneStatus();

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    if (options.id) {
      this.setData({
        addressId: options.id
      });
      if(this.data.addressId>0)
      {
        this.getAddressDetail();
      }
    }    
    if (options.fromCheckout) {
      this.setData({
        fromCheckout: (options.fromCheckout == "true" || options.fromCheckout == "1")
      });
    }
    this.getCountryList();
  },
  onReady: function () {

  },
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && regionTypeIndex - 1 < 2 && selectRegionList[regionTypeIndex-1].Id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })
    
    let selectRegionItem = selectRegionList[regionTypeIndex];
    if (regionTypeIndex == 0) {
      this.getCountryList();
    }
    else if (regionTypeIndex == 1) {
      this.getStateList(selectRegionItem.parent_id);
    }
    else {
      this.getCityList(selectRegionItem.parent_id);
    }

    //this.setRegionDoneStatus();

  },
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;


    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      if (regionType==1)
      {
        this.getStateList(regionItem.Id);
      }
      else if (regionType == 2) {
        this.getCityList(regionItem.Id);
      }
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.Id = 0;
        item.NameCn = index == 1 ? '省份' : '城市';
        item.parent_id = 0;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })


    that.setData({
      regionList: that.data.regionList.map(item => {
        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].Id == item.Id) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        return item;
      })
    });

    this.setRegionDoneStatus();

  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.CountryId = selectRegionList[0].Id;
    address.StateProvinceId = selectRegionList[1].Id;
    address.CityId = selectRegionList[2].Id;
    address.CountryName = selectRegionList[0].NameCn;
    address.State = selectRegionList[1].NameCn;
    address.City = selectRegionList[2].NameCn;
    address.FullRegion = selectRegionList.map(item => {
      if(item.Id>0)
      {
        return item.NameCn;
      }
      else{
        return "";
      }
    }).join('');

    this.setData({
      address: address,
      openSelectRegion: false
    });

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },
  getCountryList(){
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.GetCountryList, {}).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          regionList: res.CountryList.map(item => {

            //标记已选择的
            if (that.data.selectRegionList[0].Id == item.Id) {
              item.selected = true;
            } else {
              item.selected = false;
            }
            item.type = 1;
            return item;
          })
        });
      }
    });
  },
  getStateList(CountryId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.GetStateList, {
      CountryId: CountryId
    }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          regionList: res.StateList.map(item => {

            //标记已选择的
            if (that.data.selectRegionList[1].Id == item.Id) {
              item.selected = true;
            } else {
              item.selected = false;
            }
            item.type = 2;
            return item;
          })
        });
      }
    });
  },
  getCityList(StateId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.GetCityList, {
      StateId: StateId
    }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          regionList: res.CityList.map(item => {

            //标记已选择的
            if (that.data.selectRegionList[2].Id == item.Id) {
              item.selected = true;
            } else {
              item.selected = false;
            }
            item.type=3;
            return item;
          })
        });
        console.log(that.data.regionList);
      }
    });
  },
  cancelAddress() {
    let that = this;
    wx.navigateTo({
      url: '/pages/ucenter/address/address?fromCheckout=' + that.data.fromCheckout,
    })
  },
  saveAddress(){
    console.log(this.data.address)
    let address = this.data.address;

    if (address.FirstName == '') {
      util.showErrorToast('请填写收货人');

      return false;
    }

    if (address.MobileNumber == '' && address.PhoneNumber == '') {
      util.showErrorToast('请至少填写手机号码或电话号码其中一项');
      return false;
    }


    if (address.CountryId == 0 || address.StateProvinceId == 0) {
      util.showErrorToast('请选择地区');
      return false;
    }

    if (address.Address1 == '') {
      util.showErrorToast('请填写详细地址');
      return false;
    }


    let that = this;
    util.request(api.AddressSave, { 
      Id: address.Id,
      FirstName: address.FirstName,
      MobileNumber: address.MobileNumber,
      PhoneNumber: address.PhoneNumber,
      Company: address.Company,
      CountryId: address.CountryId,
      StateProvinceId: address.StateProvinceId,
      CityId: address.CityId,
      Address1: address.Address1,
      ZipPostalCode: address.ZipPostalCode,
      blDefault: address.blDefault,
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.navigateTo({
          url: '/pages/ucenter/address/address?fromCheckout=' + that.data.fromCheckout,
        })
      }
      else{
        util.showErrorToast(res.errMsg);
      }
    });

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})