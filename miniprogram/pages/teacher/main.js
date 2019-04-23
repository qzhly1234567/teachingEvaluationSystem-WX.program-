// miniprogram/pages/login.js
Page({
  data: {
    tabNow:1

  },
  onLoad: function (options) {
    let _ts = this;
    _ts.setData({
        tabNow:options.state
    })


  },
  tab:function (e) {

    this.setData({
        tabNow:e.detail
    })
      
  }
})