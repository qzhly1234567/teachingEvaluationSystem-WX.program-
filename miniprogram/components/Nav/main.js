// 没有数据页面组件
const app = getApp()
Component({
    data: {
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
    methods: {    // 这里是一个自定义方法
        tab:function (e) {
            this.setData({
                navActive:e.currentTarget.dataset.id
            })
            this.triggerEvent('myEvent',e.currentTarget.dataset.id)
        }
    },
});












