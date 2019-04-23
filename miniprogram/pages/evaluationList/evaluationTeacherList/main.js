let app = getApp();
const db = wx.cloud.database();
const formatTime = require('../../../util/date.js');
Page({
    data: {
        teachersList:[]

    },
    onLoad: function (options) {
        let _ts = this;
        _ts.data.options = options;

    },
    onShow:function () {
        let _ts = this;
        this.getData(_ts.data.options)

    },
    getData:function (options) {
        let _ts = this;
        _ts.setData({
            teachersList:[]
        })
        let teachersList = _ts.data.teachersList;
        db.collection('evaluationOfTeaching').where({
            _id: options.id,
        }).get().then(res => {
            if (res.data.length >= 1) {

                console.log(res.data);

                res.data[0].teachersList.forEach(function (v) {
                    let state = '';//学生对教师评教的状态
                    v.studentsList.forEach(function (s) {
                        if (s.sId==app.globalData.userData.stNumber){
                            state = s.state;
                        }
                    })
                    db.collection('teaches').where({
                        number: v.tId,
                    }).get().then(res => {
                        if (res.data.length >= 1) {
                            res.data[0].state = state;

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
    }
})