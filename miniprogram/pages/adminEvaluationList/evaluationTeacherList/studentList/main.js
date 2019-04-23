const db = wx.cloud.database()

Page({
    data: {},
    onLoad: function (options) {
        let _ts = this;
        db.collection('evaluationOfTeaching').where({//查找评教表
            _id: options.id,
        }).get().then(res => {
            if (res.data.length >= 1) {
                res.data[0].teachersList.forEach(function (v) {
                    if (v.tId = options.tId){//查找老师
                        let studentsList = [];
                        v.studentsList.forEach(function (b) {//查找评教该老师的学生
                            db.collection('students').where({
                                stNumber: b.sId,
                            }).get().then(res => {
                                if (res.data.length >= 1) {
                                    res.data[0].state = b.state
                                    studentsList.push(res.data[0])
                                    _ts.setData({
                                        studentsList:studentsList
                                    })
                                }
                            })
                        })
                    }
                })
                _ts.setData({
                    evaluationOfTeachingData: res.data[0]
                })
            }
        });
    }
})