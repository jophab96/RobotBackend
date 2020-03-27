var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;


/**
 * Socket Module for creating a workflow.
 * @module socketApi
 */



io.on('connection', (socket) => {

    socket.on('new-message', (message) => {
        console.log("NEW MSG REC");
        console.log(message);
    });

});


socketApi.sendNotification = function () {
    io.sockets.send(75);

}
/** @function updateWorkflowProgress
 * @description Socket Method to push the actual workflowProgress to the client.
 * @param {Number} workflowProgress - actual progress
 */
socketApi.updateWorkflowProgress = function (workflowProgress) {
    io.sockets.send(workflowProgress);

}

module.exports = socketApi;
