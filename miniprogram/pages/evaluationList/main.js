let app = getApp();
const db = wx.cloud.database();
const formatTime = require('../../util/date.js');
Page({
    data: {
        state: 1

    },
    onLoad: function (options) {
        let _ts = this;

        let parm = { classId: app.globalData.userData.classId}
        if (options.type=="teacher"){
            delete parm.classId;
            parm = { teacherId: app.globalData.userData.number}
        }
        db.collection('evaluationOfTeaching').where(parm).get().then(res => {
            if (res.data.length >= 1) {

                res.data.forEach(function (v) {
                    v.startDate = formatTime.formatTime(v.startDate).slice(0, 10);
                })


                _ts.setData({
                    evaluationOfTeachingData: res.data,
                    userData: app.globalData.userData
                })
            }

        });
    },
    onReady: function () {

    },
    to: function (e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.path
        })
    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    }
})