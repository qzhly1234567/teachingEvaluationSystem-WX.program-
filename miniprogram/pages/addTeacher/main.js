let app = getApp();
const db = wx.cloud.database();

Page({
    data: {
        age: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        sex: ["男", "女"],
        position:['院长','教授','辅导员','宿管阿姨','保安'],
        userInfoData: {}
    },
    onLoad: function (options) {
        let _ts = this;

        db.collection('class').get().then(res => {//获取班级
            _ts.setData({
                class: res.data
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
    bindPickerPosition: function (e) {
        let _ts = this;
        this.upUserInfoData('position', _ts.data.position[e.detail.value])
    },
    submit: function () {
        let _ts = this;
        let data = {
            avatar: _ts.data.userInfoData.avatar,//头想
            nickName: _ts.data.userInfoData.nickName,//姓名
            age: _ts.data.userInfoData.age,//年龄
            sex: _ts.data.userInfoData.sex,//性别
            position: _ts.data.userInfoData.position,//班级ID
            password: '111111',//默认密码
            number: 'T' + new Date().getTime().toString().slice(-6)//学号两位随机字母+6位随机数字
        }
        for (let i in data) {//校验输入项
            if (data[i] == undefined) {
                switch (i) {
                    case 'avatar':
                        toast('请选择头像')
                        break
                    case 'nickName':
                        toast('请输入姓名')
                        break
                    case 'age':
                        toast('请选择年龄')
                        break
                    case 'sex':
                        toast('请选择性别')
                        break
                    case 'position':
                        toast('请选择职位')
                        break
                }
                return
            }
        }

        function toast(str) {//信息弹出
            wx.showToast({
                title: str,
                icon: 'none'
            })
        }
        db.collection('teaches').add({
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
                        delta: 1
                    })
                }, 1000)
            }
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