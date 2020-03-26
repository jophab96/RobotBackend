var express = require('express');
var router = express.Router();

var DBManager = require('../modules/DBManager').DBManager;
var ChimeraManager = require('../modules/ChimeraManager').ChimeraManager;

const dataBaseManager = new DBManager();
const chimeraMng = new ChimeraManager();

let workflowID;
let playList;
let result = new Object();

/** @module playWorkflow */


/** @function /playWorkflow (POST)
 * API Call to start a workflow.
 * @param {Request<workflowID>} req - Input from Frontend which includes workflow id.
 * @return {Response<workflowID>} res - Response to client which includes the workflowID of the actual played workflow.
 */

router.post('/', async function (req, res) {


    workflowID = req.body.wf_id;
    workflow = await dataBaseManager.createPlayList(workflowID);


    chimeraMng.setWorkflow(workflow);
    chimeraMng.executeWorkflow();

    result.wf_id = workflowID;
    res.send(result);
});

/** @function /playWorkflow (POST)
 * API Call to check the progress of the actual processed workflow.
 * @param {Request} req - Input from Client .
 * @return {Response<Progress>} res - Response to client which includes the progress of the actual played workflow.

 */router.post('/workflowProgress', async function (req, res) {

    result.workflowProgress = chimeraMng.getWorkflowProgress();
    res.send(result);
});


module.exports = router;
