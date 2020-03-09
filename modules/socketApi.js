var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', (socket) => {

    socket.on('new-message', (message) => {
        console.log("NEW MSG REC");
        console.log(message);
    });

});
socketApi.sendNotification = function () {
    io.sockets.send(75);

}
socketApi.updateWorkflowProgress = function (progress) {
    io.sockets.send(progress);

}

module.exports = socketApi;
