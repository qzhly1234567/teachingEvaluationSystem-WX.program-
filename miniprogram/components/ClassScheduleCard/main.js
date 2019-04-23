const db = wx.cloud.database()//声明常量

// 没有数据页面组件
Component({
    data: {
        curriculumSchedule: null,
    },
    properties: {//接受来自父组件的参数
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        msg: {
            type: String,
            value: '暂无消息',
        },
      classId: {
            type: String,
            value: null,
          observers:function(e){
            console.log(111)
          }
      }
    },
  ready() {
    let _ts = this;
      console.log(_ts.properties.classId);
      db.collection('curriculumSchedule').where({ classId: _ts.data.classId }).get().then(res => {
        console.log(res.data)
        _ts.setData({
          curriculumSchedule: res.data[0]
        })
      })
    },
  
});












