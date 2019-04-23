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
        let number  = app.globalData.userData.number;
        db.collection('teaches').where({
            number: number,
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
    },
    bindPickerAge: function (e) {
        let _ts = this;
        this.upUserInfoData('age', _ts.data.age[e.detail.value])
    },
    bindPickerSex: function (e) {
        let _ts = this;
        this.upUserInfoData('sex', _ts.data.sex[e.detail.value])
    },
    bindInputNickName: function (e) {
        let _ts = this;
        this.upUserInfoData('nickName', e.detail.value)
    },
    bindInputstNumber: function (e) {
        let _ts = this;
        this.upUserInfoData('stNumber', e.detail.value)
    },
    bindPickerClass: function (e) {
        let _ts = this;
        this.upUserInfoData('classId', _ts.data.class[e.detail.value].cId)

    },
    submit: function () {
        let _ts = this;
        wx.cloud.callFunction({
            name: 'upUserInfoData',
            data: _ts.data.userInfoData,
            success: function (res) {
                console.log(res)
                if (res.result.stats.updated >= 1) {
                    wx.showToast({
                        title: '保存成功',

                    })
                    setTimeout(function () {
                        wx.reLaunch({
                            url: '/pages/student/main?state=2'
                        })
                    }, 500)
                }
            },
            fail: console.error
        })
    },
    upUserInfoData: function (key, val) {
        let userInfoData = this.data.userInfoData;
        userInfoData[key] = val;
        this.setData({
            userInfoData: userInfoData
        })
    }
})