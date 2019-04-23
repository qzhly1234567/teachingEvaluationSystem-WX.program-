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
        let data = {
            avatar: _ts.data.userInfoData.avatar,//头想
            nickName: _ts.data.userInfoData.nickName,//姓名
            mail: _ts.data.userInfoData.mail,//姓名
            age: _ts.data.userInfoData.age,//年龄
            sex: _ts.data.userInfoData.sex,//性别
            classId: _ts.data.userInfoData.classId,//班级ID
            password: '111111',//默认密码
            stNumber: getRanNum() + new Date().getTime().toString().slice(-6)//学号两位随机字母+6位随机数字
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
                    case 'mail':
                        toast('请输入邮箱')
                        break
                    case 'age':
                        toast('请选择年龄')
                        break
                    case 'sex':
                        toast('请选择性别')
                        break
                    case 'classId':
                        toast('请选择班级')
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

        function getRanNum() { //生成随机字母
            let result = [];
            for (let i = 0; i < 2; i++) {
                let ranNum = Math.ceil(Math.random() * 25);
                result.push(String.fromCharCode(65 + ranNum));
            }
            return result.join('');
        }

        db.collection('students').add({
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