let app = getApp();
const db = wx.cloud.database();
Page({
    data: {
    achievementList:null
},
onLoad: function (options) {
    let _ts = this;
    let stNumber = app.globalData.userData.stNumber;
    db.collection('achievementList').where({
        stNumber: stNumber,
    }).get().then(res => {
        console.log(res);
        if(res.data.length>=1){
          _ts.setData({
            achievementList: res.data[0]
          })
        }

    });
}
})