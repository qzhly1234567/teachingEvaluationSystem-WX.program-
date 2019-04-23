let app = getApp();
const db = wx.cloud.database();
Component({
    data: {
        userInfoData: {}
    },
    properties: {
    },
    created() {
    },
    methods: {    // 这里是一个自定义方法
        to:function (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.path
            })
        }

    },
});

