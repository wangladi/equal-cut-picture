// pages/img/img.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    cutMethod: 4,// 选中的切割图标
    imgs: [] // 分割后拿到的图片地址
  },
  swichMethod(e) {
    this.setData({
      cutMethod: e.currentTarget.dataset.num
    })
  },
  // 保存切割图片,首先将图片绘制到canvas,用canvas进行切割，切割之后转成图片，saveImageToPhotosAlbum
  saveImg() {
  //  let data
   if (this.data.cutMethod == 4) {
     this.handleImg(2,0,0)
   }
    if (this.data.cutMethod == 9) {
      this.handleImg(3, 0, 0)
    }
  },
  // 剪切图片
  handleImg(num,x,y) {
    const that = this
    wx.canvasToTempFilePath({
      x: x,
      y: y,
      width: 280 / Number(num),
      height: 280 / Number(num),
      canvasId: 'imgCanvas',
      success(res) {
        console.log('截取拿到的', res.tempFilePath)
        that.setData({
          imgs: that.data.imgs.push(res.tempFilePath)
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