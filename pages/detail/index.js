// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: { "id": "1", "name": "太平鸟广仁旗舰店", "platforms": ["拼多多","美团"], "maxDiscount": "满200减100", "startTime": "7.15 12:00"
      , "endTime": "7.16 12:00", "wxUser": "曝料人姓名", "wxUserAvatar": "/images/share.png", "content":"先充vip，然后选择300左右的下单，最多 可省215，支付金额和选择满199减120。5，支付金额和选择满199减120。5，支付金额和选择满199减120。"},
    shareNum:2368,
    discuss: 2473,
    support: 1.3,
    discussList:[
      { "id": "1", "wxUser": "第一人", "wxUserAvatar": "/images/share.png", "content":"这个活动很不错这个活动很不错这个活动很不错这个活动很不错这个活动很不错这个活动很不错这个活动很不错","dateTime":"07-22 23:00","discuss":"28","support":"170","state":"1"},
      { "id": "1", "wxUser": "第一人", "wxUserAvatar": "/images/share.png", "content": "这个活动很不错", "dateTime": "07-22 23:00", "discuss": "28", "support": "170", "state": "1" },
      { "id": "1", "wxUser": "第一人", "wxUserAvatar": "/images/share.png", "content": "这个活动很不错", "dateTime": "07-22 23:00", "discuss": "28", "support": "170", "state": "1" },
      { "id": "1", "wxUser": "第一人", "wxUserAvatar": "/images/share.png", "content": "这个活动很不错", "dateTime": "07-22 23:00", "discuss": "28", "support": "170", "state": "1" },
      { "id": "1", "wxUser": "第一人", "wxUserAvatar": "/images/share.png", "content": "这个活动很不错", "dateTime": "07-22 23:00", "discuss": "28", "support": "170", "state": "1" },
    ],     
    state:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.data.id = e.id;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})