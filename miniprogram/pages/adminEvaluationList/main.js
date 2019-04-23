let app = getApp();
const db = wx.cloud.database();
const formatTime = require('../../util/date.js');
Page({
    data: {
        state: 1

    },
    onLoad: function (options) {
    this.getData()
    },
    getData: function () {
        let _ts = this;

        db.collection('evaluationOfTeaching').get().then(res => {
                res.data.forEach(function (v) {
                    v.startDate = formatTime.formatTime(v.startDate).slice(0,10);
                })
                _ts.setData({
                    evaluationOfTeachingData: res.data,
                })

        });
    },
    to: function (e) {
        let _ts = this;
        wx.showActionSheet({
            itemList: ['查看', '删除',],
            success(res) {
                if (res.tapIndex==0){
                    wx.navigateTo({
                        url: e.currentTarget.dataset.path
                    })
                }else if (res.tapIndex==1){
                    wx.showLoading({
                        title: '删除中。。。',
                    })
                    db.collection('evaluationOfTeaching').doc(e.currentTarget.dataset.id).remove({
                        success: function (e) {
                            console.log(e.stats.removed);
                            if (e.stats.removed==1){
                                _ts.getData()

                                wx.showToast({
                                  title: '删除成功'

                                })
                            }



                        },
                        fail: console.error
                    })
                }
            }
        })
    },
})