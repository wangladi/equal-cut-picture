// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    url: '',
    imgMode: 'widthFix',
    relativeX: 0,
    relativeY: 0,
    imgW: 0,
    imgH: 0,
    imgT: 0,
    imgL: 0
  },
  imgLoadFunc(e) {
    console.log('图片信息', e.detail)
    const that = this
    const query = wx.createSelectorQuery()
    query.select('.img-box').boundingClientRect(function (rect) {
      const [w, h] = [e.detail.width, e.detail.height]
      if (w / h > 1) { // 宽度大于高度，横向平移
        const left = rect.left - 0.5 * (280 * (w / h) - 280)
        that.setData({
          imgMode: 'heightFix',
          imgH: 280,
          imgW: 'auto',
          imgT: rect.top,
          imgL: left
        })
      } else if (w / h < 1) { // 高度大于宽度，纵向平移
        const top = rect.top - 0.5 * (280 * (h / w)- 280)
        that.setData({
          imgMode: 'widthFix',
          imgW: 280,
          imgH: 'auto',
          imgL: rect.left,
          imgT: top,
        })
      } else {
        that.setData({
          imgH: 280,
          imgW: 280,
          imgL: rect.left,
          imgT: rect.top
        })
      }
    }).exec()
  },
  // 事件处理函数
  chooseImg() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: 'original',
      success: function(res) {
        // let imgUrl = ''
        // wx.navigateTo({
        //   url: `../img/img?imgUrl=${res.tempFilePaths[0]}`
        // })
        that.setData({
          url: res.tempFilePaths[0]
        })
        // console.log(that.data.url)
        console.log('图片上传成功', res)
      },
    })
  },
  reselect() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // let imgUrl = ''
        // wx.navigateTo({
        //   url: `../img/img?imgUrl=${res.tempFilePaths[0]}`
        // })
        that.setData({
          url: res.tempFilePaths[0]
        })
        // console.log(that.data.url)
        console.log('图片上传成功', res)
      },
    })
  },
  // 跳转去切割图片页面
  goCutPage() {
    if(this.data.url.length === 0) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none',
        duration: 2000
      })
    } else {
      let imgUrl = ''
      wx.navigateTo({
        url: `../img/img?imgUrl=${this.data.url}`
      })
    }
  },
  _start(e) {
    console.log('touchstart',e)
    this.setData({
      relativeX: e.touches[0].clientX - e.target.offsetLeft,
      relativeY: e.touches[0].clientY - e.target.offsetTop
    })
  },
  _move(e) {
    console.log('touchmove', e.touches[0].clientX - this.data.relativeX)
    if (this.data.imgMode === 'heightFix') {
      this.setData({
        imgL: e.touches[0].clientX - this.data.relativeX
      })
    } else {
      this.setData({
        imgT: e.touches[0].clientY - this.data.relativeY
      })
    }
  },
  _end(e) {
    console.log('touchend')
    console.log(this.data.imgL, this.data.imgT)
  },
  onLoad() {
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
