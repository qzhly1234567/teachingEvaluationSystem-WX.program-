//教师端评教数据处理
/*
*
*  {id}评教表ID
*  {number} 教师ID
*
*/
const db = wx.cloud.database();
const evaluationForm = require('../static/data/evaluationForm');//评教参数表

function teachingEvaluationDataProcessing(id,number,callback) {
    db.collection('evaluationOfTeaching').where({//查找评教表
        _id: id
    }).get().then(res => {
        if (res.data.length >= 1) {
            let data = res.data[0];
            for (let i = 0; i <= data.teachersList.length; i++) {//查找教师
                let studentsLength = 0;//已评价学生人数
                let parameterData = [];//分数
                if (number == data.teachersList[i].tId) {
                    let teacher = data.teachersList[i]
                    for (let j = 0; j < teacher.studentsList.length; j++) {
                        if (teacher.studentsList[j].state == true) {
                            studentsLength++;
                            if (j == 0) {
                                parameterData = teacher.studentsList[j].parameter
                            } else {
                                teacher.studentsList[j].parameter.forEach(function (k, l) {
                                    parameterData[l] = parseInt(parameterData[l]) + parseInt(k)
                                })
                            }
                        }
                    }
                    for(let a =0;a<parameterData.length;a++){//求平均数
                        parameterData[a] = parameterData[a]/studentsLength
                    }
                    callback(evaluationData(parameterData))
                    return
                }
            }
        }
    })
}
function evaluationData(data) {
    let form = evaluationForm.evaluationForm;
    form.forEach(function (v, i) {
        if (data[i] <= 100 && data[i] > 80) {
            v.info = v.parameter[0].msg
            v.code = data[i]
        } else if (data[i] <= 80 && data[i] > 60) {
            v.info = v.parameter[1].msg
            v.code = data[i]
        } else if (data[i] <= 60 && data[i] > 40) {
            v.info = v.parameter[2].msg
            v.code = data[i]
        } else if (data[i] <= 40 && data[i] > 20) {
            v.info = v.parameter[3].msg
            v.code = data[i]
        } else if (data[i] <= 20) {
            v.info = v.parameter[4].msg
            v.code = data[i]
        }
    })

    return form;
}
module.exports = {
    teachingEvaluationDataProcessing: teachingEvaluationDataProcessing
}