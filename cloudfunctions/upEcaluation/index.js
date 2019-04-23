// 更新数据
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    return db.collection('evaluationOfTeaching').doc(event.id).update({
        data: {
            teachersList: event.data
        }
    })
}
