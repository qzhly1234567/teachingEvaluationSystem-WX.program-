Page({
  data: {
    tabNow:1

  },
  onLoad: function (options) {
  },
  tab:function (e) {
    this.setData({
        tabNow:e.detail
    })
      
  }
})