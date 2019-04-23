const db = wx.cloud.database()

Page({
    data: {},
    onLoad: function (options) {
        let _ts = this;
        _ts.setData({
            options: options
        })
        db.collection('students').where({
            classId: options.id
        }).get().then(res => {
            _ts.setData({
                studentList: res.data
            })
        })
    },
    setUp: function (e) {
        let _ts = this;

        wx.showActionSheet({
            itemList: ["修改", "删除"],
            success: function (v) {
                console.log(v);
                if (v.tapIndex == 0) {
                    wx.navigateTo({
                        url: '/pages/upDateStudent/main?id=' + e.currentTarget.dataset.id
                    })
                } else if (v.tapIndex == 1) {
                    wx.showModal({
                        title: "您确定要删除该学生",
                        confirmText: "删除",
                        success: function (a) {
                            console.log(a);
                            if (a.confirm) {
                                db.collection('students').where({
                                    stNumber: e.currentTarget.dataset.id
                                }).get().then(res => {
                                    console.log(e.currentTarget.dataset.id);
                                    console.log(res.data[0]._id);
                                    db.collection('students').doc(res.data[0]._id).remove({
                                        success: function (c) {

                                            let studentList = _ts.data.studentList;
                                            studentList.forEach(function (v, i) {
                                                if (v.stNumber == e.currentTarget.dataset.id) {
                                                    studentList.splice(i, 1)
                                                }
                                            })
                                            _ts.setData({
                                                studentList: studentList
                                            })
                                        },
                                        fail: console.error
                                    })

                                });


                            }
                        }
                    })

                }
            }
        })

    }
})