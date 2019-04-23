let app = getApp();
const db = wx.cloud.database();
Component({
    data: {
        adminTab: [//adminTab数据&状态
            {name: "学生管理", state: true},
            {name: "教师管理", state: false}
        ]
    },
    properties: {
        tabNow: {
            type: String,
            value: '2',
            observer(e) {
                let _ts = this;
                _ts.getData()

            }
        },
    },
    created() {
        let _ts = this;
        _ts.getData()
    },
    methods: {    // 这里是一个自定义方法
        getData: function () {
            let _ts = this;
            db.collection('class').get().then(res => {
                studentslength(res.data)
            });

            function studentslength(data) {
                data.forEach(function (v) {
                    db.collection('students').where({
                        classId: v.cId
                    }).get().then(res => {
                        v.length = res.data.length;
                        _ts.setData({
                            class: data
                        })

                    });
                })
            }

            db.collection('teaches').get().then(res => {
                _ts.setData({
                    teachesList: res.data
                })
            });
        },
        to: function (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.path
            })
        },
        changeAdminTab: function (e) {
            let _ts = this;
            let adminTab = _ts.data.adminTab;
            adminTab.forEach(function (v) {
                v.state = false;
            })
            adminTab[e.currentTarget.dataset.id].state = true;
            _ts.setData({
                adminTab: adminTab
            })
        },
        setUp: function (e) {
            let _ts = this;

            wx.showActionSheet({
                itemList: ["修改", "删除"],
                success: function (v) {
                    if (v.tapIndex == 0) {
                        wx.navigateTo({
                            url: '/pages/upDateTeacher/main?id=' + e.currentTarget.dataset.id
                        })
                    } else if (v.tapIndex == 1) {
                        wx.showModal({
                            title: "您确定要删除该教师",
                            confirmText: "删除",
                            success: function (a) {
                                console.log(a);
                                if (a.confirm) {
                                    db.collection('teaches').where({
                                        number: e.currentTarget.dataset.id
                                    }).get().then(res => {
                                        console.log(e.currentTarget.dataset.id);
                                        console.log(res.data[0]._id);
                                        db.collection('teaches').doc(res.data[0]._id).remove({
                                            success: function (c) {
                                                let teachesList = _ts.data.teachesList;
                                                teachesList.forEach(function (v, i) {
                                                    if (v.number == e.currentTarget.dataset.id) {
                                                        teachesList.splice(i, 1)
                                                    }
                                                })
                                                _ts.setData({
                                                    teachesList: teachesList
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
        },
        delTeacher: function (id) {//暂时停止
            let _ts = this;

            db.collection('evaluationOfTeaching').where({
                teacherId: id
            }).get().then(res => {
                if (res.data.length >= 1) {
                    let data = res.data;
                    data.forEach(function (v) {
                        let eId = v._id;
                        v.teachersList.forEach(function (b, i) {
                            if (b.tId == id) {
                                v.teachersList.splice(i, 1)
                                v.teacherId.splice(v.teacherId.indexOf(id), 1)
                                console.log(v);

                                if (v.teacherId.length<=0){
                                    db.collection('evaluationOfTeaching').doc(eId).remove({
                                        success: function (c) {

                                        }
                                    })
                                    return
                                }
                                let data = {
                                    teacherId:v.teacherId,
                                    teachersList:v.teachersList
                                }
                                wx.cloud.callFunction({//调用云函数删除指定数据
                                    name: 'upEcaluation',
                                    data: {
                                        id: eId,
                                        data:data
                                    },
                                    success: function (res) {
                                        console.log(res)
                                        if (res.result.stats.updated >= 1) {
                                            wx.showToast({
                                                title: '删除成功',

                                            })
                                        }
                                    },
                                    fail: console.error
                                })
                            }
                        })
                    })
                }
            })
        }
    },

});
