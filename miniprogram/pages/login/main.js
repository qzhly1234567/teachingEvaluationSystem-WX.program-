const db = wx.cloud.database()//初始化小程序云能力
let app = getApp();//引入app顶层方法
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageActive: true,
        adminInfo: {
            number: '',
            password: ''
        },
        userInfo: {
            number: '',
            password: '',
            loginType: 1,//0教师登录1学生登录
        },
        type: [
            {name: "教师", state: false},
            {name: "学生", state: true}
        ]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    loginType: function (e) {//登陆类型
        let _ts = this;
        let loginType = e.detail.value;
        let type = _ts.data.type;
        let userInfo = _ts.data.userInfo;
        type.forEach(function (e) {
            e.state = false;
        })
        type[loginType].state = true;
        userInfo.loginType = loginType;
        _ts.setData({
            type: type,
            userInfo:userInfo
        })
    },
    user: function (e) {
        let _ts = this;
        let userInfo = _ts.data.userInfo;
        switch (e.currentTarget.dataset.type) {
            case 'number':
                userInfo.number = e.detail.value;
                break;
            case 'password':
                userInfo.password = e.detail.value;
                break;
            case 'signIn':
                if (userInfo.number == "" || userInfo.password == "") {
                    wx.showToast({
                        title: '请填写完整的账号和密码',
                        icon: "none"
                    })
                    return
                }
                let dataBase = 'students'//数据库
                let parm = {stNumber: userInfo.number};
                let path = "/pages/student/main";
                if (userInfo.loginType==0){
                    dataBase = 'teaches'
                    delete parm.stNumber;
                    parm = {number: userInfo.number};
                    path = "/pages/teacher/main";
                }

                db.collection(dataBase).where(parm).get().then(res => {
                    console.log(parm);
                    console.log(res);
                    if (res.data.length <= 0) {
                        //没有该用户
                        wx.showToast({
                            title: '未找到该用户,请联系管理员',
                            icon: "none"
                        })
                    } else {
                        if (res.data[0].password == userInfo.password) {
                            //登录成功-跳转
                            app.globalData.userData = res.data[0];
                            wx.showToast({
                                title: '登录成功'
                            })
                            setTimeout(function () {
                                wx.reLaunch({
                                    url: path
                                })
                            }, 500)
                        } else {
                            wx.showToast({
                                title: '密码错误',
                                icon: "none"
                            })
                        }
                    }
                })
                break;
        }
    },
    addTeacher: function (e) {
        db.collection('teaches').add({
            data: {
                avatar: e.avatarUrl,
                nickName: e.nickName,
                position: null,
                sex: null,
                age: null

            },
            success(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                console.log(res)
            },
            fail: console.error
        })
    },
    addStudent: function (e) {
        db.collection('students').add({
            data: {
                avatar: e.avatarUrl,
                nickName: e.nickName,
                sex: null,
                age: null,
                stNumber: null,
                classId: null
            },
            success(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                console.log(res)
            },
            fail: console.error
        })
    },
    pageTab: function () {
        let that = this;
        that.setData({
            pageActive: !that.data.pageActive
        })
    },
    admin: function (e) {//管理员登录模块
        let _ts = this;
        let adminInfo = _ts.data.adminInfo;
        switch (e.currentTarget.dataset.type) {
            case 'number':
                adminInfo.number = e.detail.value;
                break;
            case 'password':
                adminInfo.password = e.detail.value;
                break;
            case 'signIn':
                if (_ts.data.adminInfo.number == "" || _ts.data.adminInfo.password == "") {
                    wx.showToast({
                        title: '请填写完整的账号和密码',
                        icon: "none"
                    })
                    return
                }
                db.collection('administrators').where({
                    number: _ts.data.adminInfo.number,
                }).get().then(res => {
                    console.log(res.data)
                    if (res.data.length <= 0) {
                        //没有该用户
                        wx.showToast({
                            title: '未找到该用户',
                            icon: "none"
                        })
                    } else {
                        if (res.data[0].password == _ts.data.adminInfo.password) {
                            //登录成功-跳转
                            wx.showToast({
                                title: '登录成功'
                            })
                            setTimeout(function () {
                                wx.reLaunch({
                                    url: '/pages/admin/main'
                                })
                            }, 500)
                        } else {
                            wx.showToast({
                                title: '密码错误',
                                icon: "none"
                            })
                        }
                    }
                })
                break;
        }
        _ts.setData({
            adminInfo: adminInfo
        })
    }
})