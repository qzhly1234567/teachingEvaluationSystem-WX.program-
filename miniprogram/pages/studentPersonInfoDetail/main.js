let app = getApp();
const db = wx.cloud.database();

Page({
    data: {
        age: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        sex: ["男", "女"],
        userInfoData: {}
    },
    onLoad: function (options) {
        let _ts = this;
        let stNumber  = app.globalData.userData.stNumber;
        db.collection('students').where({
            stNumber: stNumber,
        }).get().then(res => {
            res.data[0].type = "student";
            _ts.setData({
                userInfoData: res.data[0]
            })
        });
        db.collection('class').get().then(res => {//获取班级
            _ts.setData({
                class: res.data
            })
        })
    }
})