const WXAPI = require("../../wxapi/main.js")
var QQMapWX = require('../../utils/qqmap/qqmap-wx-jssdk.js');
const utils = require('../../utils/util.js');
var qqmapsdk;
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrls: [
      '/images/banner@2x.png',
      '/images/banner2.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    category: [{
        "id": "1",
        "name": "吃货"
      },
      {
        "id": "2",
        "name": "靓装"
      },
      {
        "id": "3",
        "name": "畅行"
      },
      {
        "id": "4",
        "name": "住家"
      },
      {
        "id": "5",
        "name": "其它"
      },
      {
        "id": "6",
        "name": "其它2"
      },
      {
        "id": "7",
        "name": "其它3"
      }
    ],
    activeCategoryId: 1,
    pageNo: 1,
    pageSize: 5,
    province: "",
    city: "",
    goodsList: [
      // { "id": "1", "name": "太平鸟广仁旗舰店", "platform": "拼多多", "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      //     , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar":"/images/user.jpg"},
      // { "id": "1", "name": "太平鸟广仁旗舰店", "platform": "拼多多", "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      //     , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar": "/images/user.jpg" },
      // { "id": "1", "name": "太平鸟广仁旗舰店", "platform": "拼多多", "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      //     , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar": "/images/user.jpg" },
      // { "id": "1", "name": "太平鸟广仁旗舰店", "platform": "拼多多", "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      //     , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar": "/images/user.jpg" },
      // { "id": "1", "name": "太平鸟广仁旗舰店", "platform": "拼多多", "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      //     , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar": "/images/user.jpg" },
      // { "id": "1", "name": "太平鸟广仁旗舰店", "platform": "拼多多", "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      //     , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar": "/images/user.jpg" },
      // { "id": "1", "name": "太平鸟广仁旗舰店", "platform": "拼多多", "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      //     , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar": "/images/user.jpg" },
    ],
    isHiddenLoadMore: false,
    isHiddenRefresh: false,
    city: '杭州市',
    province: '浙江省',
    cityCode:'330100',
    userInfo: {},
    hasUserInfo:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nowDate:null,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    const that = this;
    that.getLocation();
    that.getGoodsList();
    var date = utils.formatDateTime(new Date());
    // console.log(date);
    this.setData({
      nowDate: date
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '0元购、折上折、霸王餐、满减，一查便知',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    }
  },
  // 获取用户信息
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    
    var sessionKey = wx.getStorageSync("sessionKey");
    // 保存后台用户信息
    WXAPI.userInfo({
      sessionKey: sessionKey,
      signature: e.detail.signature,
      rawData: e.detail.rawData,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then( res => {
      // console.log(res)
      // 设置用户信息成功，取消授权接口
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      wx.setStorageSync("userInfo", app.globalData.userInfo)
    })
  },
  // 类目选择
  categoryChange: function(e) {
    const that = this
    // 更改选择样式
    that.setData({
      activeCategoryId: e.currentTarget.id,
      pageNo: 1,
      isHiddenRefresh: false,
      isHiddenLoadMore: false,
    });
    that.getGoodsList(false)
  },
  // 上滑事件
  upper: function(e) {
    const that = this
    that.setData({
      isHiddenRefresh: true,
      pageNo: 1
    });
    that.getGoodsList(false)
    setTimeout(() => {
      // 隐藏下拉刷新的布局
      that.setData({
        isHiddenRefresh: false,
      });
    }, 2000);
  },
  // 下滑事件
  lower: function(e) {
    const that = this
    that.setData({
      isHiddenLoadMore: true,
      isHiddenRefresh: false,
      pageNo: that.data.pageNo + 1
    });
    that.getGoodsList(true)
    setTimeout(() => {
      // 隐藏上拉加载的布局
      that.setData({
        isHiddenLoadMore: false,
      });
    }, 2000);
  },
  // 滚动事件
  scroll: function(e) {
    //滚动事件
    const that = this
    that.setData({
      isHiddenRefresh: false,
    });
  },
  // 获取位置信息
  getLocation: function() {
    const that = this
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: app.globalData.qqmapsdkKey
    });
    // 定位当前位置
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        // const speed = res.speed
        // const accuracy = res.accuracy
        // 根据经纬度获取省市
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            if (res.status == 0) {
              var city = res.result.address_component.city;
              var province = res.result.address_component.province;
              var cityCode = res.result.ad_info.city_code.substring(3);
             // console.log(cityCode);
              that.setData({
                city: city,
                province: province,
                cityCode: cityCode
              })
            }
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            //console.log(res);
          }
        });
      }
    });
  },
  // 获取商品列表
  getGoodsList: function(append) {
    const that = this
    // console.log("刷新商品信息")
    WXAPI.goodsList({
      category: that.data.activeCategoryId,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      city: that.data.cityCode
    }).then(res => {
      // console.log(res.result)
      if (res.result == 1) {
        let goodsList = []
        if (append) {
          goodsList = that.data.goodsList
        }
        var length = res.data.list.length
        if (length > 0) {
          for (var i = 0; i < length; i++) {
            var goods = res.data.list[i]
            // 数据检查若不规范，不进行填充
            //console.log(goods.name + ":" + goods.platform + ":" + goods.maxDiscount + ":" + goods.startTime + ":" + goods.endTime)
            goodsList.push(goods)
          }
        }
        that.setData({
          goodsList: goodsList
        })
      }
    });
  }
})