let app = getApp();
const db = wx.cloud.database();
Page({
    data: {
        teacheDetail:null
    },
    onLoad: function (options) {
        let _ts = this;
        db.collection('teaches').where({
            number:options.number

        }).get().then(res => {
            console.log(res);
            _ts.setData({
                teacheDetail: res.data[0]
            })
        });
    }

})