var express = require('express');
var router = express.Router();

var DBManager = require('../modules/DBManager').DBManager;

const dataBaseManager = new DBManager();
let processingWorkflowID;
let inputWorkflow;



/**
 * API Module for creating a workflow.
 * @module createWorkflow
 */

/** @function /createWorkflow (POST)
 * API Call to create a new Workflow.
 * @param {Request} req - Input from Frontend which includes Workflow.
 * @param {Response} res -

 */

router.post('/', async function (req, res) {

    inputWorkflow = req.body.jsondata;
    dataBaseManager.open();
    processingWorkflowID =dataBaseManager.createWorkflow(inputWorkflow._name);
    dataBaseManager.addJobs(inputWorkflow._jobsObjects);
    dataBaseManager.close();
    res.send(processingWorkflowID);

});



module.exports = router;
