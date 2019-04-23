let app = getApp();
const db = wx.cloud.database();
const evaluationForm = require('../../../static/data/evaluationForm');
const formatTime = require('../../../util/date.js');
const TEDP = require('../../../util/teachingEvaluationDataProcessing');


Page({
    data: {
        items: [
            {name: '100', value: 'A'},
            {name: '80', value: 'B'},
            {name: '60', value: 'C'},
            {name: '40', value: 'D'},
            {name: '20', value: 'E'},
        ],
        parameterData: []
    },
    onLoad: function (options) {
        let _ts = this;
        _ts.data.options = options;
        _ts.setData({
            evaluationForm: evaluationForm.evaluationForm,
            options: options,
            teacheInfo: app.globalData.userData
        })
        _ts.getEvaluation()
    },
    getEvaluation: function () {
        let _ts = this;
        let id = _ts.data.options.id;//评教表ID
        let number = _ts.data.teacheInfo.number;//教师ID
        TEDP.teachingEvaluationDataProcessing(id,number,function (data) {//求教师端评教信息模块，详见util
            _ts.setData({
                evaluationForm:data
            })
        })
    }
})