// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    url: ''
  },
  // 事件处理函数
  chooseImg() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        let imgUrl = ''
        wx.navigateTo({
          url: `../img/img?imgUrl=${res.tempFilePaths[0]}`
        })
        // that.setData({
        //   url: res.tempFilePaths[0]
        // })
        // console.log(that.data.url)
        console.log('图片上传成功', res)
      },
    })
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
