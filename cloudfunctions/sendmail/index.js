const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465,               // SMTP 端口
    secure: true,            // 使用 SSL
    auth: {
        user: '2637368579@qq.com',   //发邮件的邮箱
        pass: 'hszpdftalltbdjjh'        //POP3/SMTP  不是密码
    }
});
exports.main = async (event, context) => {
    let mailOptions = {
        from: '2637368579@qq.com',   // 发件地址
        to: event.mail,    // 收件列表
        subject: '你还未评教，请及时登录评教系统评教',      // 标题
        text: '你还未评教，请及时登录评教系统评教' //内容
    };
    const info = await transporter.sendMail(mailOptions);
    return info
}