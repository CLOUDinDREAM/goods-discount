const WXAPI = require("wxapi/main.js")
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

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
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    qqmapsdkKey: 'HKUBZ-6KOWQ-J265Q-GI2NY-SFH5T-J5BWL'
  }
})