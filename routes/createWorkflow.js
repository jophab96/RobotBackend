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
 * @description API Call to start a workflow
 * @param {Request<Workflow>} req - Input from client which includes Workflow
 * @return {Response<mongoose.Types.ObjectId>} res - Response to client which includes the workflowID of the actual created workflow
 */

router.post('/', async function (req, res) {


    inputWorkflow = req.body.jsondata;
    dataBaseManager.open();
    processingWorkflowID = dataBaseManager.createWorkflow(inputWorkflow._name);
    dataBaseManager.addJobs(inputWorkflow._jobsObjects);
    dataBaseManager.close();
    res.send(processingWorkflowID);

});



module.exports = router;
