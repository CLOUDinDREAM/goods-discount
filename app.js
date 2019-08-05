const WXAPI = require("wxapi/main.js")
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否重启应用',
        success(res) {
          if (res.confirm) {
            // 新版本已经下载好，调用applyUpdate应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });

    // 初次加载判断网络情况，无网络状态下进行调整
    wx.getNetworkType({
      success: function (res) {
        const networkType = res.networkType
        // console.log("网络测试：" + networkType)
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        } else {
          that.globalData.isConnected = true
          wx.hideToast()
        }
      }
    });
    // 监听网络状态变化
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {
            that.goStartIndexPage()
          }
        })
      }
    });
    // // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        WXAPI.login(res.code).then(res => {
          // console.log(res)
          if(res.result == 1){
            // 设置用户openId信息
            const openId = res.data.openid;
            const sessionKey = res.data.sessionKey; 
            wx.setStorageSync("openId", openId);
            wx.setStorageSync("sessionKey", sessionKey);
          }
        });
      }
    });
  },
  goStartIndexPage: function () {
    setTimeout(function () {
      wx.redirectTo({
        url: "/pages/index/index"
      })
    }, 500)
  }, 
  globalData: {
    isConnected: true,
    hasUserInfo: false,
    userInfo: null,
    qqmapsdkKey: 'HKUBZ-6KOWQ-J265Q-GI2NY-SFH5T-J5BWL'
  }
})