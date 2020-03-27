var express = require('express');
var router = express.Router();
var DBManager = require('../modules/DBManager').DBManager;


const dataBaseManager = new DBManager();
let result = new Object();
let inputWorkflow;

/** @module updateWorkflow */

/** @function /updateWorkflow (POST)
 * @description API Call to update a workflow.
 * @param {Request<Workflow>} req - Input from Frontend which includes updated workflow.
 * @return {Response<mongoose.Types.ObjectId>} res - Response to client.

 */

router.post('/', async function (req, res, next) {

    inputWorkflow = req.body.jsondata;
    await dataBaseManager.updateWorkflow(inputWorkflow);

    result.wf_id = inputWorkflow._id;

    res.send(result);


});




module.exports = router;
