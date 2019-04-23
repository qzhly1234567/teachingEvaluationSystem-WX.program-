let app = getApp();
const db = wx.cloud.database();
const evaluationForm = require('../../../../static/data/evaluationForm');
const formatTime = require('../../../../util/date.js');

Page({
    data: {
        items: [
            {name: '100', value: 'A'},
            // {name: 'CHN', value: '中国', checked: 'true'},
            {name: '80', value: 'B'},
            {name: '60', value: 'C'},
            {name: '40', value: 'D'},
            {name: '20', value: 'E'},
        ],
        parameterData: []

    },
    onLoad: function (options) {
        let _ts = this;
        _ts.data.options = options;


        if (options.type == 'true') {
            _ts.getEvaluation()
        }
        db.collection('teaches').where({//获取教师信息
            number: options.tId,
        }).field({
            avatar: true,
            nickName: true,
            number: true,
            position: true
        }).get().then(res => {
            if (res.data.length >= 1) {
                _ts.setData({
                    teacheInfo: res.data[0]
                })
            }
        });
        _ts.setData({
            evaluationForm: evaluationForm.evaluationForm,
            options: options
        })
    },
    radioChange: function (e) {
        let value = e.detail.value;
        let index = e.currentTarget.dataset.id;
        let _ts = this;
        let parameterData = _ts.data.parameterData;
        parameterData[index] = value;
        _ts.setData({
            parameterData: parameterData
        })
    },
    submit: function () {
        let _ts = this;
        const PARM_LENGTH = 7;//评教选项参数长度

        if (_ts.options.type=='true'){
            wx.showToast({
                title: '您已评教过了,请勿重复评教',
                icon: 'none'
            })
            return
        }
        for (let i = 0; i < PARM_LENGTH; i++) {
            if (_ts.data.parameterData[i] == undefined) {
                console.log(_ts.data.parameterData[i]);
                wx.showToast({
                    title: '请将表单填写完整',
                    icon: 'none'
                })
                return
            }
        }
        db.collection('evaluationOfTeaching').where({
            _id: _ts.data.options.id,
        }).get().then(res => {
            if (res.data.length >= 1) {
                res.data[0].teachersList.forEach(function (v) {//遍历查询老师
                    if (_ts.data.options.tId == v.tId) {
                        v.studentsList.forEach(function (b) {//遍历查询学生
                            if (b.sId == app.globalData.userData.stNumber) {
                                b.parameter = _ts.data.parameterData
                                b.state = true;
                                wx.showLoading({
                                    title: '提交中...',
                                    mask: true
                                })
                                _ts.update(res.data[0].teachersList)
                            }
                        })
                    }
                })
                _ts.setData({
                    evaluationOfTeachingData: res.data[0]
                })
            }

        });
    },

    getEvaluation: function () {
        let _ts = this;
        db.collection('evaluationOfTeaching').where({
            _id: _ts.data.options.id,
        }).get().then(res => {
            if (res.data.length >= 1) {
                res.data[0].teachersList.forEach(function (v) {//遍历查询老师
                    if (_ts.data.options.tId == v.tId) {
                        v.studentsList.forEach(function (b) {//遍历查询学生
                            if (b.sId == app.globalData.userData.stNumber) {
                                _ts.setData({
                                    parameterData: b.parameter
                                })

                            }
                        })
                    }
                })
            }

        });
    },
    update: function (data) {
        let _ts = this;
        console.log(111);
        wx.cloud.callFunction({
            name: 'upEcaluation',
            data: {
                id: _ts.data.options.id,
                data: data
            },
            success: res => {
                console.log()
                if (res.result.stats.updated > 0) {
                    wx.hideLoading()

                    wx.showToast({
                        title: '提交成功'
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 500)
                }

            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err)
                wx.navigateTo({
                    url: '../deployFunctions/deployFunctions',
                })
            }
        })
    }
})