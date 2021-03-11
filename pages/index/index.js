// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    url: '',
    ratio: 1,//图片宽高比
    imgMode: 'widthFix',// hieghtFix为扁图
    // 裁剪区域的位置
    areaLeft: 0,
    areaTop: 0,
    relativeX: 0,
    relativeY: 0,
    initLeft: 0, // 图片初始值left
    initTop: 0, // 图片初始值Top
    imgW: 0,
    imgH: 0,
    imgT: 0,
    imgL: 0
  },
  // 将原图绘制在画布上
  draw() {
    const that = this
    const ctx = wx.createCanvasContext("imgCanvas", that);
    // ctx.drawImage(that.data.url, 0, 0, that.data.imgW, that.data.imgH);
    // ctx.draw()
    wx.getImageInfo({
      src: that.data.url,
      success(res) {
        console.log('新拿到的路径', res, that.data.imgW, that.data.imgH)
        //在这里进行canvas
        const [path, width, height] = [res.path, res.width, res.height] //本地图片路径/图片的宽/图片的高
        ctx.drawImage(path, 0, 0, that.data.imgW, that.data.imgH)
        ctx.draw()
      }
    })
    // const path = 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3302399998,3216746631&fm=26&gp=0.jpg'
    // wx.downloadFile({
    //   url: path,
    //   success(res) {
    //     if (res.statusCode === 200) {
    //       console.log('啥玩意', res)
    //       wx.playVoice({
    //         filePath: res.tempFilePath
    //       })
    //       const ctx = wx.createCanvasContext("imgCanvas", that);
    //       ctx.drawImage(res.tempFilePath, 0, 0, that.data.imgW, that.data.imgH);
    //       ctx.draw()
    //     }
    //   }
    // })
  },
  // 图片加载
  imgLoadFunc(e) {
    console.log('图片信息', e.detail)
    const that = this
    const query = wx.createSelectorQuery()
    query.select('.img-box').boundingClientRect(function (rect) {
      const [w, h] = [e.detail.width, e.detail.height]
      that.setData({
        areaLeft: rect.left,
        areaTop: rect.top,
        ratio: w / h
      })
      if (w / h > 1) { // 宽度大于高度，横向平移
        const left = rect.left - 0.5 * (280 * (w / h) - 280)
        that.setData({
          imgMode: 'heightFix',
          imgH: 280,
          imgW: 280 * that.data.ratio,
          imgT: rect.top,
          imgL: left,
          initLeft: left
        })
      } else if (w / h < 1) { // 高度大于宽度，纵向平移
        const top = rect.top - 0.5 * (280 * (h / w)- 280)
        that.setData({
          imgMode: 'widthFix',
          imgW: 280,
          imgH: 280 / that.data.ratio,
          imgL: rect.left,
          imgT: top,
          initTop: top
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
    this.draw()
  },
  // 事件处理函数
  chooseImg() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: 'original',
      sourceType: ['album', 'camera'],
      success(res) {
        // let imgUrl = ''
        // wx.navigateTo({
        //   url: `../img/img?imgUrl=${res.tempFilePaths[0]}`
        // })
        that.setData({
          url: res.tempFilePaths[0]
        })
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
      },
    })
  },
  // 跳转去切割图片页面
  goCutPage() {
    let x,y
    if (this.data.imgMode === 'heightFix') { // 横图
      y = 0
      x = this.data.areaLeft - this.data.imgL
    } else {
      x = 0
      y = this.data.areaTop - this.data.imgT
    }
    const that = this
    wx.canvasToTempFilePath({
      x: x,
      y: y,
      width: 280,
      height: 280,
      canvasId: 'imgCanvas',
      success(res) {
        wx.navigateTo({
          url: `../img/img?imgUrl=${res.tempFilePath}`
        })
      }
     })
    // if(this.data.url.length === 0) {
    //   wx.showToast({
    //     title: '请先上传图片',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // } else {
    //   let imgUrl = ''
    //   wx.navigateTo({
    //     url: `../img/img?imgUrl=${this.data.url}`
    //   })
    // }
  },
  _start(e) {
    this.setData({
      relativeX: e.touches[0].clientX - e.target.offsetLeft,
      relativeY: e.touches[0].clientY - e.target.offsetTop
    })
  },
  _move(e) {
    const [curLeft, curTop, sL, sT] = 
      [
        (e.touches[0].clientX - this.data.relativeX), 
        (e.touches[0].clientY - this.data.relativeY),
        this.data.initLeft,
        this.data.initTop
      ]
    if (this.data.imgMode === 'heightFix') {
      if (curLeft <= this.data.areaLeft && curLeft >= (2 * sL - this.data.areaLeft)) {
        this.setData({
          imgL: curLeft
        })
      }
    } else {
      if (curTop <= this.data.areaTop && curTop >= (2 * sT - this.data.areaTop)) {
        this.setData({
          imgT: curTop
        })
      }
    }
  },
  _end(e) {
    console.log(this.data.imgL, this.data.imgT)
  },
  onLoad() {
  }
})
