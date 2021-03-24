// pages/img/img.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    cutMethod: 4,// 选中的切割图标
    imgs: [], // 分割后拿到的图片地址
    fourData: [
      { x: 0, y: 0, side: 140 },
      { x: 140, y: 0, side: 140 },
      { x: 0, y: 140, side: 140 },
      { x: 140, y: 140, side: 140 },
    ],
    nineData: [
      { x: 0, y: 0, side: 280 / 3 },
      { x: 280 / 3, y: 0, side: 280 / 3 },
      { x: 560 / 3, y: 0, side: 280 / 3 },
      { x: 0, y: 280 / 3 , side: 280 / 3 },
      { x: 280 / 3, y: 280 / 3, side: 280 / 3 },
      { x: 560 / 3, y: 280 / 3, side: 280 / 3 },
      { x: 0, y: 560 / 3, side: 280 / 3 },
      { x: 280 / 3, y: 560 / 3, side: 280 / 3 },
      { x: 560 / 3, y: 560 / 3, side: 280 / 3 }
    ],
    // 是否拥有相机权限
    authStaus: false,
    // 图片保存成功
    saveNum: 0

  },
  swichMethod(e) {
    this.setData({
      saveNum: 0,
      cutMethod: e.currentTarget.dataset.num
    })
  },
  // 保存切割图片,首先将图片绘制到canvas,用canvas进行切割，切割之后转成图片，saveImageToPhotosAlbum
  saveImg() {
    console.log('保存图片', this.data.saveNum)
   if (Number(this.data.cutMethod) === 4) {
     console.log('进来了吗')
     for (let item of this.data.fourData) {
       this.handleImg(item.side, item.x, item.y)
     }
    
   }
    if (Number(this.data.cutMethod) === 9) {
      for (let item of this.data.nineData) {
        this.handleImg(item.side, item.x, item.y)
      }
    }
  },
  // 获取到分割图片的地址
  handleImg(side,x,y) {
    const that = this
    wx.canvasToTempFilePath({
      x: x,
      y: y,
      width: side,
      height: side,
      canvasId: 'squareCanvas',
      success(res) {
        that.setData({
          imgs: [...that.data.imgs, res.tempFilePath]
        })
        if (!that.data.authStaus) {
          that.getAuth(res.tempFilePath)
        } else {
          that.saveToAlbum(res.tempFilePath)
        }
      }
    })
  },
  // 将图片保存到手机上
  getAuth(path) {
    console.log('进来获取权限')
    const that = this
    // 获取用户权限是否允许访问相机
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(authRes) {
              that.setData({
                authStaus: true
              })
              that.saveToAlbum(path)
            }
          })
        } else {
          that.setData({
            authStaus: true
          })
          that.saveToAlbum(path)
        }
      }
    })
  },
  //拿到权限保存图片到相册
  saveToAlbum(path) {
    console.log('看看', this.data.saveNum)
    const num = this.data.saveNum
    this.setData({
      saveNum: num + 1
    })
    const that = this
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success(res) {
          if (Number(that.data.saveNum) === Number(that.data.cutMethod)){
            wx.showToast({
              title: '所有图片已保存成功',
              duration: 2000
            })
          }
        },
        fail(err) {
          wx.showToast({
            title: '图片保存失败,请重新保存!!',
            duration: 2000
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url: options.imgUrl
    })
    const ctx = wx.createCanvasContext("squareCanvas", this);
    ctx.drawImage(options.imgUrl, 0, 0, 280, 280)
    ctx.draw()
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