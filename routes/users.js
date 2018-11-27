var express = require('express');
var router = express.Router();
var uuid = require('uuid')
var xss = require('xss')
var sms = require('../service/sms')
var User = require('../models/user')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// 获得手机验证码接口
router.post('/getCode', async (req, res, next) => {
    //判定是否用发送短信
    var flag = true

    // 判定传参是否有手机号
    var phoneNumber = req.body.phoneNumber
    if (!phoneNumber) {
        res.json({
            status: 1,
            msg: '手机号为空',
            result: ''
        })
        return next
    }


    // 生成短信验证码
    var verifyCode = sms.getCode()
    console.log(verifyCode)

    var user = new User({
        phoneNumber: xss(phoneNumber),
        verifyCode: verifyCode,
    })

    try {
        user = await user.save()
    } catch (e) {
        var user = await User.findOne({phoneNumber: phoneNumber}, (err, doc) => {
            console.log(doc.verified)
            // 还未注册成功  且第一次验证码未收到
            if (!doc.verified) {
                doc.verifyCode = verifyCode
                doc.save()

                var msg = '您的注册验证码是:' + user.verifyCode
                sms.send(user.phoneNumber, msg)
                res.json({
                    status: 0,
                    msg: '',
                    result: '验证码已发送'
                })
                return next

            } else {
                // 注册成功  且还想再次注册
                flag = false
                res.json({
                    status: 1,
                    msg: e,
                    result: '手机号已注册'
                })
                return next
            }
        })
    }


    try {
        if (flag) {
            // 编辑短信内容
            var msg = '您的注册验证码是:' + user.verifyCode
            sms.send(user.phoneNumber, msg)
            res.json({
                status: 0,
                msg: '',
                result: ''
            })
        }
        return ''
    } catch (e) {
        console.log(e)
        res.json({
            status: 1,
            msg: e,
            result: '短信服务出错'
        })
        return ''
    }
})

// 注册接口
router.post('/register', async (req, res, next) => {
    var body = req.body
    var phoneNumber = body.phoneNumber
    var verifyCode = body.verifyCode
    var password = body.password

    if (!verifyCode || !phoneNumber || !password) {
        res.json({
            status: 1,
            msg: '校验未通过',
            result: ''
        })
        return next
    }

    var user = await User.findOne({
        phoneNumber: phoneNumber,
        verifyCode: verifyCode
    })

    if (user) {
        user.accessToken = uuid.v4() // 生成用户唯一凭证
        user.verified = true // 注册成功
        user.password = password

        user = await user.save()

        res.cookie('accessToken', user.accessToken, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24
        })
        res.json({
            status: 0,
            msg: '',
            result: {
                user: user
            }
        })

    } else {
        res.json({
            status: 1,
            msg: '校验未通过',
            result: ''
        })
        return next
    }

})

// 认证接口(获取用户基本信息)
router.post('/checkLogin', async (req, res, next) => {
    var accessToken = req.cookies.accessToken
    var user = await User.findOne({accessToken: accessToken})
    if (user) {
        res.json({
            status: 0,
            msg: '',
            result: {
                user: user
            }
        })
    }
})

// 登录接口
router.post('/login', async (req, res, next) => {
    var body = req.body
    var phoneNumber = body.phoneNumber
    var password = body.password

    var user = await User.findOne({
        phoneNumber: phoneNumber,
        password: password
    })

    if (user) {
        res.cookie('accessToken', user.accessToken, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24
        })
        res.json({
            status: 0,
            msg: '',
            result: {
                user: user
            }
        })
    } else {
        res.json({
            status: 1,
            msg: '校验未通过',
            result: ''
        })
        return next
    }

})

// 更新用户信息
router.post('/update', async (req, res, next) => {
    var accessToken = req.body.accessToken
    var password = req.body.password
    var nickname = req.body.nickname
    var avatar = req.body.avatar

    user = await User.findOne({accessToken: accessToken})
    if (user) {
        if (password) {
            user.password = password
        }
        if (nickname) {
            user.nickname = nickname
        }
        if (avatar) {
            user.avatar = avatar
        }
        user.meta.updateAt = Date.now()
        user = await user.save()
        res.json({
            status: 0,
            msg: '修改成功',
            result: {
                user: user
            }
        })
    } else {
        res.json({
            status: 1,
            msg: '校验未通过',
            result: ''
        })
        return next
    }
})

// 注销用户信息
router.post('/logout', async (req, res, next) => {
    res.cookie('accessToken', '', {
        path: '/',
        maxAge: -1
    })
    res.json({
        status: 0,
        msg: '注销成功',
        result: ''
    })
})


module.exports = router;
