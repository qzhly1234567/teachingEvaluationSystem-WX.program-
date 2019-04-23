const db = wx.cloud.database();
// hszpdftalltbdjjh
Page({
    data: {
        tabNow: 1

    },
    onLoad: function (options) {
    },
    tab: function (e) {
        this.setData({
            tabNow: e.detail
        })

    }
})