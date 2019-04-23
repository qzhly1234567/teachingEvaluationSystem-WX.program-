// 更新数据
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    if (event.type=="student"){
        return db.collection('students').doc(event.id).update({
            // data 传入需要局部更新的数据
            data: {
                age: event.age,
                avatar: event.avatar,
                classId: event.classId,
                nickName: event.nickName,
                sex: event.sex,
                stNumber: event.stNumber,
            }
        })

    }else if(event.type=="teacher"){
        return db.collection('teaches').doc(event._id).update({
            // data 传入需要局部更新的数据
            data: {
                age: event.age,
                avatar: event.avatar,
                nickName: event.nickName,
                sex: event.sex,
                position:event.position
            }
        })
    }

}
