
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var timerSchema = new Schema({
    timerlist: {
        imgs: Array,  // 图片地址
        createdtime:  {
            type: Date,
            default: Date.now()
        }, // 创建时间
        title: String, // 标题
        msg: String, // 描述信息
        perssion: {
            type: Boolean,
            default: false
        },         //  信息是否公开
    }
})

module.exports = mongoose.model('Timer', timerSchema)