var express = require('express');
var router = express.Router();

var DBManager = require('../modules/DBManager').DBManager;

const dataBaseManager = new DBManager();
let workflowID;
let result = new Object();

/**
 * API Module for creating a workflow.
 * @module deleteWorkflow
 */

/** @function /deleteOne (POST)
 * API Call to delete one workflow.
 * @param {Request<workflowID>} req - Input from client which includes workflow id
 * @return {Response<workflowID>} res - Response to client which includes the workflowID of the actual deleted workflow
 */

router.post('/deleteOne', function (req, res) {

    workflowID = req.body.wf_id;
    dataBaseManager.deleteWorkflow(workflowID);
    result.wf_id = workflowID;

    res.send(result);

});




/** @function /deleteAll (POST)
 * API Call to delete all workflows.
 * @param {Request} req - Input from client
 * @return {Response<String>} res - Response to client
 */
router.post('/deleteAll', async function (req, res) {

    dataBaseManager.deleteAllWorkflows();
    res.send('ok');

});




module.exports = router;
