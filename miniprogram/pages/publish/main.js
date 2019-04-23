let app = getApp();
const db = wx.cloud.database();
Page({
    data: {
        classParm: [],
        teacherParm: [],
        date: ""
    },
    onLoad: function (options) {
        let _ts = this;
        db.collection('teaches').get().then(res => {
            _ts.setData({
                teaches: res.data
            })
        });
        db.collection('class').get().then(res => {//获取班级
            _ts.setData({
                class: res.data
            })
        })
    },
    changeEndTime: function (e) {
        let _ts = this;
        let date = new Date(e.detail.value)
        _ts.setData({
            dateParm: date,
            date: e.detail.value
        })
    },
    checkboxChange: function (e) {
        console.log(e.detail.value);
        let _ts = this;
        let data = e.detail.value;
        _ts.setData({
            classParm: data,
        })
    },
    checkboxTeacher: function (e) {
        let _ts = this;
        let data = e.detail.value;

        _ts.setData({
            teacherParm: data,
        })
    },
    submit: function (e) {
        let _ts = this;
        let teachersList = []//教师列表
        let studentsList = []//学生列表
        //查找所选班级拥有的学生
        const _ = db.command;
        let classParm = _ts.data.classParm;
        let teacherParm = _ts.data.teacherParm;
        let date = _ts.data.date;
        if (classParm.length <= 0) {
            wx.showToast({
                title: '至少选择一个班级',
                icon: 'none'
            })
            return
        }
        if (teacherParm.length <= 0) {
            wx.showToast({
                title: '至少选择一个教师',
                icon: 'none'
            })
            return

        }
        if (date == "") {
            wx.showToast({
                title: '请选择评教截止时间',
                icon: 'none'
            })
            return

        }
        db.collection('students').where({//获取指定班级的学生
            classId: _.in(classParm)
        }).get().then(res => {
            res.data.forEach(function (v) {
                let data = {
                    parameter: [],
                    state: false,
                    mail:v.mail,
                    sId: v.stNumber
                };
                studentsList.push(data)
            })
            _ts.data.teaches.forEach(function (v) {
                _ts.data.teacherParm.forEach(function (u) {
                    if (v.number == u) {
                        let data = {
                            tId: u,
                            studentsList: studentsList
                        }
                        teachersList.push(data)
                    }
                })
            })
            addData()
        })
        function addData() {//上传评教数据
            let data = {
                classId: _ts.data.classParm,//班级
                startDate: new Date(),//开始时间
                endDate: new Date(_ts.data.date,),//结束时间
                state: false,//开关
                teacherId: _ts.data.teacherParm,
                teachersList: teachersList
            }
            db.collection('evaluationOfTeaching').add({
                data: data
            }).then(res => {
                console.log(res)
                if (res._id) {
                    wx.showToast({
                        title: '添加成功',
                        icon: 'none'
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            delta:1
                        })
                    },1000)
                }
            })
        }
    }
})