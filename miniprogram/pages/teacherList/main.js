let app = getApp();
const db = wx.cloud.database();
Page({
    data: {
        teaches:null
    },
    onLoad: function (options) {
        let _ts = this;
        db.collection('teaches').get().then(res => {
            console.log(res);
            _ts.setData({
                teaches: res.data
            })
        });
    },
    to:function (e) {
        wx.navigateTo({
            url: '/pages/teacherInfoDetail/main?number='+e.currentTarget.dataset.number
        })
    }

})





