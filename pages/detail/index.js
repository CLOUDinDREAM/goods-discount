// pages/detail/index.js
const WXAPI = require("../../wxapi/main.js")
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityDetail: {
      // "id": "1", "name": "太平鸟广仁旗舰店", "platforms": ["拼多多","美团"], "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      // , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar": "/images/share.png", "content":"先充vip，然后选择300左右的下单，最多 可省215，支付金额和选择满199减120。         5，支付金额和选择满199减120。5，支付金额和选择满199减120。"
    },
    repostCount: 0,
    commentCount: 0,
    likeCount: 0,
    discussList: [
      // { "id": "1", "wxUser": "第一人", "wxUserAvatar": "/images/share.png", "content": "这个活动很不错这个活动很不错这个活动很不错这个活动很不错这个活动很不错这个活动很不错这个活动很不错", "dateTime": "07-22 23:00", "discuss": "28", "support": "170","status":"1"},
      // { "id": "1", "wxUser": "第一人", "wxUserAvatar": "/images/share.png", "content": "这个活动很不错", "dateTime": "07-22 23:00", "discuss": "28", "support": "170", "status": "1" } ,
    ],
    pageNo: 1,
    pageSize: 10,
    supportEnsure: true,
    canReply: false,
    backColorShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    const that = this;
    // 获取活动信息
    let openId = wx.getStorageSync("openId");
    var activityId = e.id;
    this.setData({
      activityId: activityId
    });

    WXAPI.goodsDetail(activityId, openId).then(res => {
      // console.log(res)
      if (res.result == 1) {
        var activityDetail = res.data;
        var status = res.data.likeStatus;
        that.setData({
          activityDetail: activityDetail,
          supportEnsure: status == 0 ? false : true,
          repostCount: activityDetail.repostCount,
          commentCount: activityDetail.commentCount,
          likeCount: activityDetail.likeCount,
        })
      }
    });
    // 获取评论列表
    that.refreshDiscuss();
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
  onReachBottom: function(e) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    const that = this;
    // 请求转发接口
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)     
    }
    let openId = wx.getStorageSync("openId");
    WXAPI.shareAdd(that.data.activityId, openId).then(res => {
      if (res.result == 1) {
        that.setData({
          repostCount: this.data.repostCount+1,
        })
      }
    });
    return {
      title: this.data.activityDetail.name + "  " + this.data.activityDetail.maxDiscount,
      path: '/pages/detail/index?id=' + this.data.goodsId,
    }
  },
  // 点赞
  supportChange(e) {
    const that = this;
    // 获取用户信息
    let openId = wx.getStorageSync("openId");
    var supportEnsure = that.data.supportEnsure;
    if (!supportEnsure) {
      WXAPI.supportAdd(that.data.activityId, openId).then(res => {
        console.log(res)
        if (res.result == 1) {
          that.setData({
            supportEnsure: true,
            likeCount: that.data.likeCount + 1,
          });
        }
      });
    }
  },
  discussChange(e) {
    const that = this;
    that.setData({
      canReply: true,
      backColorShow: true,
    })
  },
  // 发送评论
  submitForm(e) {
    const that = this;
    var content = e.detail.value.content;
    if (content == '') {
      wx.showToast({
        title: '评论不可为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 获取用户信息
    let openId = wx.getStorageSync("openId");
    WXAPI.discussAdd({
      openId: openId,
      activityId: that.data.activityId,
      content: content
    }).then(res => {
      console.log(res)
      if (res.result == 1) {
        that.setData({
          canReply: false,
          backColorShow: false,
          commentCount: that.data.commentCount + 1,
        });
        // 刷新评论列表
        that.refreshDiscuss();
      }
    });
  },
  closeReply(e) {
    const that = this;
    console.log(e)
    that.setData({
      canReply: false,
      backColorShow: false,
    })
  },
  refreshDiscuss: function () {
    const that = this;
    // 获取评论信息
    WXAPI.discuss(
      that.data.activityId, 
    {
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
    }).then(res => {
      // console.log(res) 
      if (res.result == 1) {
        var discussList = res.data.list;
        that.setData({
          discussList: discussList,
        })
      }
    });
  },
})