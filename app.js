var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var playWorkflowRouter = require('./routes/playWorkflow');
var createWorkflowRouter = require('./routes/createWorkflow');
var readWorkflowRouter = require('./routes/readWorkflow');
var deleteWorkflowRouter = require('./routes/deleteWorkflow');
var csComm = require('./routes/CSComm');

var updateWorkflowRouter = require('./routes/updateWorkflow');
var RobotDataServiceRouter = require('./routes/RobotDataService');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/playWorkflow', playWorkflowRouter);
app.use('/deleteWorkflow', deleteWorkflowRouter);
app.use('/createWorkflow', createWorkflowRouter);
app.use('/readWorkflow', readWorkflowRouter);
app.use('/updateWorkflow', updateWorkflowRouter);
app.use('/RobotDataService', RobotDataServiceRouter);
app.use('/CSComm', csComm);


/*=======================Sockets Part===========
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3030;

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


server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

==================*/
/*=======================Sockets End=============================*/


//MONGOOSE
mongoose.connect('mongodb://localhost/mongo');

mongoose.model('methods', {name: String});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
