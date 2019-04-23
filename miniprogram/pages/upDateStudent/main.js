let app = getApp();
const db = wx.cloud.database();

Page({
    data: {
        age: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        sex: ["男", "女"],
        userInfoData: {
        }
    },
    onLoad: function (options) {
        let _ts = this;
        _ts.setData({
            id: options.id
        })
        _ts.getData()
        db.collection('class').get().then(res => {//获取班级
            _ts.setData({
                class: res.data
            })
        })
    },
    getData: function () {
        let _ts = this;
        db.collection('students').where({
            stNumber: _ts.data.id
        }).get().then(res => {//获取班级
            console.log(res);
            res.data[0].type = 'student';
            _ts.setData({
                userInfoData: res.data[0]
            })
        })
    },
    bindAvatar: function (e) {
        let _ts = this;
        let userInfoData = _ts.data.userInfoData;
        wx.showLoading({
            title: "上传中",
        })
        wx.chooseImage({
            count: 1,
            success: chooseResult => {
                wx.cloud.uploadFile({
                    // 指定上传到的云路径
                    cloudPath: 'avatar/' + new Date().getTime() + '.png',
                    // 指定要上传的文件的小程序临时文件路径
                    filePath: chooseResult.tempFilePaths[0],
                    // 成功回调
                    success: res => {
                        console.log('上传成功', res)
                        userInfoData.avatar = res.fileID
                        _ts.setData({
                            userInfoData: userInfoData
                        })
                        wx.showToast({
                            title: '上传成功'
                        })
                    },
                })
            },
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
    bindInputMail: function (e) {
        let _ts = this;
        this.upUserInfoData('mail', e.detail.value)
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
                if (res.result.stats.updated >= 1) {
                    wx.showToast({
                        title: '保存成功',
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 1
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