let app = getApp();
const db = wx.cloud.database();
Component({
    data: {
        userInfoData: {}
    },
    properties: {
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
    },
    methods: {    // 这里是一个自定义方法
        to:function (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.path
            })
        }

    },
});

