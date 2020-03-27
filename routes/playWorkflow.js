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
 * @description API Call to start a workflow.
 * @param {Request<mongoose.Types.ObjectId>} req - Input from Frontend which includes workflow id.
 * @return {Response<mongoose.Types.ObjectId>} res - Response to client which includes the workflowID of the actual played workflow.
 */

router.post('/', async function (req, res) {


    workflowID = req.body.wf_id;
    workflow = await dataBaseManager.createPlayList(workflowID);


    chimeraMng.setWorkflow(workflow);
    chimeraMng.executeWorkflow();

    result.wf_id = workflowID;
    res.send(result);
});

/** @function /workflowProgress (POST)
 * @description API Call to check the progress of the actual processed workflow.
 * @param {Request} req - Input from Client .
 * @return {Response<Number>} res - Response to client which includes the progress of the actual played workflow.

 */router.post('/workflowProgress', async function (req, res) {

    result.workflowProgress = chimeraMng.getWorkflowProgress();
    res.send(result);
});


module.exports = router;
