var express = require('express');
var router = express.Router();

var DBManager = require('../modules/DBManager').DBManager;

const dataBaseManager = new DBManager();
let processingWorkflowID;
let inputWorkflow;

router.post('/', async function (req, res, next) {

    inputWorkflow = req.body.jsondata;
    dataBaseManager.open();
    processingWorkflowID =dataBaseManager.createWorkflow(inputWorkflow._name);
    dataBaseManager.addJobs(inputWorkflow._jobsObjects);
    dataBaseManager.close();
    res.send(processingWorkflowID);

});

router.get('/', function (req, res, next) {

    printAllWorkflows();
    res.send('OK');

});


module.exports = router;
