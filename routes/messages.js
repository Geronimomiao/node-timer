var express = require('express');
var router = express.Router();
var User = require('../models/user')

// 添加 timer 信息
router.post('/add', async (req, res) => {
    var accessToken = req.cookies.accessToken
    var timerlist = req.body.timerlist
    console.log(timerlist)
    var user = await User.findOne({accessToken: accessToken})
    if (user) {
        user.timerlist.push(timerlist)
        user = await user.save()
        res.json({
            status: 1,
            msg: '',
            result: user
        })
    } else {
        res.json({
            status: 0,
            msg: 'token 有误',
            result: ''
        })
    }
})

// 修改 timer 信息
router.post('/update', async (req, res) => {
    var timerlist_id = req.body.id
    var timerlist = req.body.timerlist
    var accessToken = req.cookies.accessToken
    var user = await User.findOne({accessToken: accessToken})
    if (user) {
        user.timerlist.forEach(item => {
            if (item._id == timerlist_id) {
                item.finaltime = timerlist.finaltime
                item.title = timerlist.title
                item.msg = timerlist.msg
            }
        })
        user = await user.save()
        res.json({
            status: 1,
            msg: '',
            result: user
        })
    } else {
        res.json({
            status: 0,
            msg: 'token 有误',
            result: ''
        })
    }
})

// 删除 timer 信息
router.post('/delete', async (req, res) => {
    var timerlist_id = req.body.id
    var accessToken = req.cookies.accessToken
    var user = await User.update({
        accessToken: accessToken
    }, {
        $pull: {
            'timerlist': {
                '_id': timerlist_id
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: 0,
                msg: '删除失败  ',
                result: ''
            })
        } else {
            res.json({
                status: 0,
                msg: '删除失败  ',
                result: ''
            })
        }
    })

})

// 查询 timer 信息
router.post('/list', async (req, res) => {
    var accessToken = req.cookies.accessToken
    var user = await User.findOne({accessToken: accessToken})
    if (user) {
        res.json({
            status: 1,
            msg: '',
            result: user.timerlist
        })
    }
})

module.exports = router;