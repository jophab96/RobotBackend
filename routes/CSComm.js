var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {

    socketApi.sendNotification();
    res.sendfile('index.html');
});



module.exports = router;
