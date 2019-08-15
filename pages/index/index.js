const WXAPI = require("../../wxapi/main.js")
const QQMapWX = require('../../utils/qqmap/qqmap-wx-jssdk.js');
const utils = require('../../utils/util.js');
const loginUtil = require('../../utils/login.js');
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
      }
    ],
    activeCategoryId: 1,
    pageNo: 1,
    pageSize: 5,
    goodsList: [
      // { "id": "1", "name": "太平鸟广仁旗舰店", "platform": "拼多多", "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      //     , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar":"/images/user.jpg"},
      // { "id": "1", "name": "太平鸟广仁旗舰店", "platform": "拼多多", "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      //     , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar": "/images/user.jpg" }
    ],
    isHiddenLoadMore: false,
    isHiddenRefresh: false,
    city: '杭州市',
    province: '浙江省',
    cityCode: '330100',

    // 用户信息
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 列表展示
    height: 0, // scroll-wrap 的高度，这个高度是固定的
    inner_height: 0, // inner-wrap 的高度，这个高度是动态的
    scroll_top: 0, // 滚动到位置。
    start_scroll: 0, // 滚动前的位置。
    touch_down: 0 // 触摸时候的 Y 的位置
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady: function() {
    let self = this;
    const query = wx.createSelectorQuery()
    query.select('#scroll-wrap').boundingClientRect()
    query.exec(function(res) {
      self.data.height = res[0].height;
    });
  },
  onLoad: function() {
    const that = this;
    that.getLocation();
    that.getGoodsList();
    // 首次进入页面需要登录
    this.login();
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    } else {
      return {
        title: '0元购、折上折、霸王餐、满减，一查便知',
        path: '/pages/index/index',
        imageUrl: '/images/share.png'
      }
    }
  },
  // 获取用户信息
  getUserInfo: function(e) {
    // console.log(e.detail.userInfo)
    if (!e.detail.userInfo) {
      return;
    }
    var sessionKey = wx.getStorageSync("sessionKey");
    // todu 若sessionKey不存在，则需要重新登陆
    // 保存后台用户信息
    WXAPI.userInfo({
      sessionKey: sessionKey,
      signature: e.detail.signature,
      rawData: e.detail.rawData,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then(res => {
      // 设置用户信息成功，取消授权接口
      if (res.result == 1) {
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        });
        wx.setStorageSync("userInfo", e.detail.userInfo)
      }
    })
  },
  login: function() {
    const that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        WXAPI.login(res.code).then(res => {
          if (res.result == 1) {
            // 设置用户openId信息
            const openId = res.data.openid;
            const sessionKey = res.data.sessionKey;
            wx.setStorageSync("openId", openId);
            wx.setStorageSync("sessionKey", sessionKey);
            // 检查用户信息是否完整
            WXAPI.checkUser(openId).then(res => {
              if (res.result == 1) {
                var userInfo = utils.isBlank(res.data[0].nickname)
                if (res.data.length == 1 && !userInfo) {
                  wx.setStorageSync("userInfo", res.data[0]);
                  that.setData({
                    hasUserInfo: true
                  })
                }
              }
            });
          }
        });
      }
    });
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
              that.setData({
                city: city,
                province: province,
                cityCode: cityCode
              });
              wx.setStorageSync("cityCode", cityCode)
            }
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
          }
        });
      }
    });
  },
  // 获取商品列表
  getGoodsList: function(append) {
    const that = this
    var lastPage = wx.getStorageSync('lastPage');
    if (lastPage != "" && lastPage != null) {
      if (that.data.pageNo > lastPage) {
        return;
      }
    }
    // console.log("刷新商品信息")
    WXAPI.goodsList({
      category: that.data.activeCategoryId,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      city: that.data.cityCode
    }).then(res => {
      if (res.result == 1) {
        wx.setStorageSync('lastPage', res.data.lastPage)
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
  },
  goToDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  // start: 触摸开始
  start_fn(e) {
    //console.log(e)
    let self = this;
    let touch_down = e.touches[0].clientY;
    this.data.touch_down = touch_down;
    // 获取 inner-wrap 的高度
    const query = wx.createSelectorQuery()
    query.select('#inner-wrap').boundingClientRect();
    query.select('#scroll-wrap').fields({
      scrollOffset: true,
      size: true
    });
    query.exec(function(res) {
      // console.log(res)
      self.data.inner_height = res[0].height;
      self.data.start_scroll = res[1].scrollTop;
      self.data.height = res[1].height.toFixed(0);
    });
  },
  // end: 触摸开始
  // start： 触摸结束
  end_fn(e) {
    //console.log(e)
    let current_y = e.changedTouches[0].clientY;
    let self = this;
    let {
      start_scroll,
      inner_height,
      height,
      touch_down
    } = this.data;
    /**
     * 1、下拉刷新
     * 2、上拉加载
     */
    if (current_y > touch_down && current_y - touch_down > 20 && start_scroll == 0) {
      // 下拉刷新 的请求和逻辑处理等
      //console.log("下拉刷新")
      self.upper()
    } else if (current_y < touch_down && touch_down - current_y >= 20 && inner_height - height == start_scroll) {
      // 上拉加载 的请求和逻辑处理等
      //console.log("上拉加载")
      self.lower()
    }
  },
  // end: 触摸结束
  // 下滑事件
  upper: function() {
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
  // 上滑事件
  lower: function() {
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
})