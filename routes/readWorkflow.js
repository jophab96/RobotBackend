var express = require('express');
var router = express.Router();

var DBManager = require('../modules/DBManager').DBManager;


const dataBaseManager = new DBManager();


/** @module readWorkflow */




function formatWorkflows(workflows) {

    var wf_list = [];

    for (let workflow of workflows) {

        var wf = {_id: workflow._id, _name: workflow.name, _created_at: workflow.created_at};
        wf_list.push(wf);
    }

    return wf_list;
}

/** @function /findOneJob (POST)
 * API Call to find one Job.
 * @param {Request} req - Input from Frontend which includes job id.
 * @param {Response} res -

 */

router.post('/findOneJob', async function (req, res) {

    res.send(await dataBaseManager.findOneJob());


});

/** @function /readOne (POST)
 * API Call to find and return one Job.
 * @param {Request} req - Input from Frontend which includes job id.
 * @param {Response} res -

 */


router.post('/readOne', async function (req, res, next) {

    //Get Workflow out of DB (Key : wf:id)
    let workflow = await dataBaseManager.findOneMappedWorkflow(req.body.wf_id);
    //Get Job Details out ob DB (with Jobs FK of WF)
    let detailedJobs = await dataBaseManager.createJobList(workflow._jobsObjects);
    //Push Job Details into Workflow
    workflow._jobsObjects = detailedJobs;

    res.send(workflow);


});

router.post('/readAll', async function (req, res, next) {


    //Grab all WFs out of DB
    let workflows = await dataBaseManager.findAllWorkflows();
    //Format Workflows
    let formatedWorkflows = formatWorkflows(workflows);
    //Send Result
    res.send(formatedWorkflows);


});

router.post('/readOneJob', async function (req, res, next) {

    //Grab one Job out of DB
    let job = await dataBaseManager.findOneJob(req.body.job_id);
    //Send Result
    res.send(job);


});

router.post('/', async function (req, res, next) {

    //Grab one Job out of DB
    let playList = await dataBaseManager.createPlayList(req.body.wf_id);
    //Send Result
    res.send(playList);


});


module.exports = router;
