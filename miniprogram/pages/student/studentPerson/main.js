let app = getApp();
const db = wx.cloud.database();
Component({
    data: {
        userInfoData: {}
    },
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        type: {//nav类型1学生2老师3管理员
            type: Number,
            value: 1,
        },
        navActive:{//定位
            type: Number,
            value: 1,
        }
    },

    created() {
        let _ts = this;
        let stNumber = app.globalData.userData.stNumber;
        db.collection('students').where({
            stNumber: stNumber,
        }).get().then(res => {
            res.data[0].type = "student";
            console.log(res.data[0]);
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
    methods: {    // 这里是一个自定义方法
        tab:function (e) {
            this.setData({
                navActive:e.currentTarget.dataset.id
            })
            this.triggerEvent('myEvent',e.currentTarget.dataset.id)
        },
        to:function (e) {
            wx.navigateTo({
              url: e.currentTarget.dataset.path
            })
        },
        quit:function () {
            delete app.globalData.userData;
            wx.navigateTo({
                url: '/pages/login/main'
            })
        }

    },
});

