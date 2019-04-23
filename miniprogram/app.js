//app.js

let userData1 = {//测试用学生测试

    _id: "XHyGYsDR1TiNq-bv"
    ,age: 20
    ,avatar: "cloud://base--9a2dfb.6261-base--9a2dfb/avatar/1552222083285.png"
    ,classId: "c1"
    ,nickName: "刘勇"
    ,password: "111111"
    ,sex: "男"
  , stNumber: "QQ102368"
}
let userData2 = {//测试用教师测试
        _id: "XHvsnMDR1TiNqpW6"
        ,age: null
        , avatar: "cloud://base--9a2dfb.6261-base--9a2dfb/avatar/teacher2.png"
        , nickName: "张飞"
        , number: "T286911"
        ,password: "111111"
        ,position: "教授"
        ,sex: null
    }
App({
    onLaunch: function () {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
            })
        }
        this.globalData = {
            navActive: 1,
            // userData:userData1,
            // userData:userData2
            userData:{}
        }
    }
})
