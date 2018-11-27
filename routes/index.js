var express = require('express');
var router = express.Router();
var qiniu = require('../service/qiniu')
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/timer')
mongoose.connection.on("connected", function () {
    console.log("MongoDB Connected success")
})
mongoose.connection.on("error", function () {
    console.log("MongoDB Connected fail")
})
mongoose.connection.on("disconnected", function () {
    console.log("MongoDB Connected disconnected")
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/getToken', (req, res) => {
    var key = req.body.key
    var token = qiniu.uptoken(key)
    res.json({
        stutas: 0,
        msg: '',
        result: token
    })
})

module.exports = router;
