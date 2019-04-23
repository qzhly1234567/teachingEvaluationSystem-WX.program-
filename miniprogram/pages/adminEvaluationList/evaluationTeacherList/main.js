let app = getApp();
const db = wx.cloud.database();
const formatTime = require('../../../util/date.js');
Page({
    data: {
        teachersList:[]

    },
    onLoad: function (options) {
        let _ts = this;

        let teachersList = _ts.data.teachersList;
        db.collection('evaluationOfTeaching').where({
            _id: options.id,
        }).get().then(res => {
            if (res.data.length >= 1) {
                res.data[0].teachersList.forEach(function (v) {
                    db.collection('teaches').where({
                        number: v.tId,
                    }).get().then(res => {
                        if (res.data.length >= 1) {
                            teachersList.push(res.data[0])
                            _ts.setData({
                                teachersList:teachersList
                            })
                        }
                    })
                })
                _ts.setData({
                    evaluationOfTeachingData: res.data[0]
                })
            }

        });
    },
    to: function (e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.path
        })
    },
})