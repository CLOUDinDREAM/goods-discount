const WXAPI = require("../wxapi/main.js")
const utils = require('util.js');
const login = () => {
  var result = false;
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
                wx.setStorageSync("hasUserInfo", true);
                wx.setStorageSync("userInfo", res.data[0]);
              }
            }
          });
        }
      });
    }
  });
}
// 小程序未保存用户相关信息，需要重新登陆获取最新的用户信息
const register = (sessionKey) => {
  if (utils.isBlank(sessionKey)){
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
                  wx.setStorageSync("hasUserInfo", true);
                  wx.setStorageSync("userInfo", res.data[0]);
                }else{
                  // 用户信息不完整，则需要重新获取
                  wx.getUserInfo({
                    success: function (res) {
                      WXAPI.userInfo({
                        sessionKey: sessionKey,
                        signature: res.signature,
                        rawData: res.rawData,
                        encryptedData: res.encryptedData,
                        iv: res.iv
                      }).then(res => {
                        // 设置用户信息成功，取消授权接口
                        if (res.result == 1) {
                          wx.setStorageSync("hasUserInfo", true);
                          wx.setStorageSync("userInfo", res.userInfo)
                        }
                      })
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  }
}
module.exports = {
  login,
  register: (sessionKey) =>{
    return register(sessionKey);
  }
}