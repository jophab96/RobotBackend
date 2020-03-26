var express = require('express');
var router = express.Router();

var DBManager = require('../modules/DBManager').DBManager;


const dataBaseManager = new DBManager();


/** @module readWorkflow */



/** @function formatWorkflows
 * Method to format a list of workflows.
 * @param {List<workflow>} workflows - list of workflows
 * @return {List<workflow>} wf_list - formated list of workflows
 */

function formatWorkflows(workflows) {

    var wf_list = [];

    for (let workflow of workflows) {

        var wf = {_id: workflow._id, _name: workflow.name, _created_at: workflow.created_at};
        wf_list.push(wf);
    }

    return wf_list;
}

/** @function /findOneJob (POST)
 * API Call to find one job.
 * @param {Request} req - Input from Frontend which includes job id.
 * @param {Response} res -

 */

router.post('/findOneJob', async function (req, res) {

    res.send(await dataBaseManager.findOneJob());


});


router.post('/readOne', async function (req, res) {

    //Get Workflow out of DB (Key : wf:id)
    let workflow = await dataBaseManager.findOneMappedWorkflow(req.body.wf_id);
    //Get Job Details out ob DB (with Jobs FK of WF)
    let detailedJobs = await dataBaseManager.createJobList(workflow._jobsObjects);
    //Push Job Details into Workflow
    workflow._jobsObjects = detailedJobs;

    res.send(workflow);


});

/** @function /readAll (POST)
 * API Call to return all workflows
 * @param {Request} req - Input from client
 * @param {Response<workflow>} res - Response which inclues a list of workflows

 */

router.post('/readAll', async function (req, res ) {


    //Grab all WFs out of DB
    let workflows = await dataBaseManager.findAllWorkflows();
    //Format Workflows
    let formatedWorkflows = formatWorkflows(workflows);
    //Send Result
    res.send(formatedWorkflows);


});

/** @function /readOneJob (POST)
 * API Call to return one specific job
 * @param {Request<jobID>} req - Input from client which includes job id
 * @param {Response<job>} res - Response which inclues the requested job


 */

router.post('/readOneJob', async function (req, res) {

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
