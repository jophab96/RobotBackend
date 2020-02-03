var express = require('express');
var router = express.Router();

/**
var socketApi = require('../modules/socketApi');
var io = socketApi.io;


//const io = require('socket.io')(server);

const port = process.env.PORT || 3030;

io.listen(port);
*/
/*
io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('new-message', (message) => {
        console.log("NEW MSG REC");
        console.log(message);
    });

    socket.on('send mess', (obj) => {
        console.log(obj);
        io.sockets.emit('add mess', obj);
    })
});

*/



router.get('/', function(req, res) {

    socketApi.sendNotification();
    res.sendfile('index.html');
});





module.exports = router;
