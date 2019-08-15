// pages/broke/index.js
const utils = require('../../utils/util.js');
const WXAPI = require("../../wxapi/main.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasSubmit: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("111")
    this.login();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  login: function() {
    const that = this;
    var userInfo = wx.getStorageSync("userInfo")
    if (userInfo) {
      that.setData({
        hasUserInfo: true
      })
      return;
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        WXAPI.login(res.code).then(res => {
          // console.log(res)
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
  // 获取用户信息
  getUserInfo: function(e) {
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
          hasUserInfo: true
        });
        wx.setStorageSync("userInfo", e.detail.userInfo)
      }
    })
  },
  submitForm(e) {
    const that = this;
    if (that.data.hasSubmit) {
      wx.showToast({
        title: '提交中，不可重复提交',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    const name = e.detail.value.name;
    const platform = e.detail.value.platform;
    if (name == "" || platform == "") {
      wx.showToast({
        title: '提交信息不可为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    that.setData({
      hasSubmit: true
    })
    // 获取用户信息
    let openId = wx.getStorageSync("openId");
    let cityCode = wx.getStorageSync("cityCode");
    WXAPI.broke({
      openId: openId,
      name: name,
      platform: platform,
      cityCode: cityCode
    }).then(res => {
      that.setData({
        hasSubmit: false
      })
      if(res.result == 1){
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 2000
        })       
        that.setData({
          form_info: "",
        })      
      }
      else{
        wx.showToast({
          title: '提交失败，请重新提交',
          icon: 'none',
          duration: 2000
        }) 
      }
    });
  },
})