
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var userSchema = new Schema({
    phoneNumber: {
        unique: true, // 防止用户反复注册
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },                // 校验用户是否注册成功
    verifyCode: String, // 短信验证码
    avatar:    {
        type: String,
        default: '../../static/img/test.jpg'
    }, // 用户头像路径
    password: String,
    nickname: {
        type: String,
        default: '内测人员'
    },
    accessToken: String, // 用户的唯一凭证
    timerlist: [{
        imgs: Array,  // 图片地址
        createdtime:  {
            type: Date,
            default: Date.now()
        }, // 创建时间
        finaltime: String, // 储存时长
        title: String,  // 标题
        msg: String,  //  描述
        permssion: {
            type: Boolean,
            default: false
        },         //  信息是否公开
    }]
})

module.exports = mongoose.model('User', userSchema)