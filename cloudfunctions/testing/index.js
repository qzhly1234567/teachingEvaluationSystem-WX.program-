//该模块定时启动于每日早10点，主动查询延期评教列表内未评教的学生并且发送评教提醒邮件，多个重复邮件合并发送。
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'test-demo-id'   //环境初始化
})
const db = cloud.database()
const nowTime = new Date().getTime()//当前时间
// 云函数入口函数
exports.main = async (event, context) => {
    db.collection('evaluationOfTeaching').get().then(res => {
        let arr = []
        res.data.forEach(function (v) {
            if (nowTime > new Date(v.endDate).getTime()) {//今天时间大于文档结束时间
                console.log(v);
                v.state = false;
                v.teachersList.forEach(function (b) {
                    b.studentsList.forEach(function (n) {
                        if (n.state == false) {
                            if (arr.indexOf(n.mail)==-1){//因为测试 所有的邮箱名都为2637368579@qq.com 多个相同的邮箱名只会发送一个邮件，
                                arr.push(n.mail)
                            }
                        }
                    })
                })
            }
        })
        arr.forEach(function (v) {//遍历发送调用邮件发送模块
            send(v)
        })
        function send(mail) {
            cloud.callFunction({
                name:'sendmail',
                data: {mail:mail},
            })
        }
    });
}
