const API_BASE_URL = "https://www.lexiangjk.com/test/sz"

const request = (url, method, data) => {
  let _url = API_BASE_URL + url 
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-type' : 'application/x-www-form-urlencoded'
      },
      success(request){
        resolve(request.data)
      },
      fail(error){
        reject(error)
      },
      complete(aaa){
        // 加载完成
      }
    })
  })
}
// 小程序promise扩展finally方法
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}
module.exports = {
  request,
  login : (code) => {
    return request('/wx/login', 'get', {code})
  },
  checkUser: (openId) => {
    return request('/wx', 'get', { openId })
  },
  userInfo: (data) => {
    return request('/wx/info', 'post',data)
  },
  goodsList : (data) => {
    return request('/activity','get',data)
  },
  goodsDetail: (id,openId) => {
    return request('/activity/'+id, 'get', { openId })
  },
  // 转发
  shareAdd: (id, openId) => {
    return request('/repost/' + id, 'post', { openId })
  },
  // 评论
  discuss: (id, data) => {
    return request('/comment/' + id, 'get', data)
  },
  discussAdd: (data) => {
    return request('/comment', 'post', data)
  },
  // 点赞
  supportAdd: (id, openId) => {
    return request('/like/' + id, 'post', { openId })
  },
  broke: (data) => {
    return request('/tips', "post", data)
  }
}