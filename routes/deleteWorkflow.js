var express = require('express');
var router = express.Router();

var DBManager = require('../modules/DBManager').DBManager;

const dataBaseManager = new DBManager();
let workflowID;
let result = new Object();

router.post('/deleteOne', function (req, res, next) {

    workflowID = req.body.wf_id;
    dataBaseManager.deleteWorkflow(workflowID);
    result.wf_id = wfId;

    res.send(result);

});

router.post('/deleteAll', async function (req, res, next) {

    dataBaseManager.deleteAllWorkflows();
    res.send('ok');

});

router.get('/', function (req, res, next) {

    printAllWorkflows();
    res.send('OK');

});


module.exports = router;
