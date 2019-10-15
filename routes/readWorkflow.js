var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var DBManager = require('../modules/DBManager').DBManager;


var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';
var MOVE_BASE_NAME = 'BaseMove';
var MOVE_ARM_CARTESIAN_NAME = 'ArmCartesian';


const dataBaseManager = new DBManager();


async function createJobList(jobs) {

    var j = [];

    for (let job of jobs) {


        var dbJob = await dataBaseManager.findOneJob(mongoose.Types.ObjectId(job._id_job_fk));

        switch (dbJob.job_type) {


            case (GRIPPER_GRIP_NAME):

                var listjob = {_id: dbJob._id, _name: dbJob.job_type, _activationTimeout: dbJob.activationTimeout};
                j.push(listjob);
                break;

            case (GRIPPER_RELEASE_NAME):
                var listjob = {_id: dbJob._id, _name: dbJob.job_type, _activationTimeout: dbJob.activationTimeout};
                j.push(listjob);
                break;

            case (MOVE_BASE_NAME):
                var listjob = {_id: dbJob._id, _name: dbJob.job_type, _activationTimeout: dbJob.activationTimeout,_goalPose:dbJob.goalPose};
                j.push(listjob);
                break;

            case (MOVE_ARM_CARTESIAN_NAME):
                var listjob = {_id: dbJob._id, _name: dbJob.job_type, _activationTimeout: dbJob.activationTimeout,_goalPose:dbJob.goalPose};
                j.push(listjob);
                break;


        }

    }

    return j;

}


function formatWorkflows(workflows) {

    var wf_list = [];

    for (let workflow of workflows) {

        var wf = {_id: workflow._id, _name: workflow.name, _created_at: workflow.created_at};
        wf_list.push(wf);
    }

    return wf_list;
}

router.post('/findOneJob', async function (req, res, next) {

    //Get Workflow out of DB (Key : wf:id)
    res.send(await dataBaseManager.findOneJob());


});

router.post('/readOne', async function (req, res, next) {

    //Get Workflow out of DB (Key : wf:id)
    var workflow = await dataBaseManager.findOneMappedWorkflow(mongoose.Types.ObjectId(req.body.wf_id));

    console.log(workflow);
    //Get Job Details out ob DB (with Jobs FK of WF)
  var detailedJobs = await createJobList(workflow._jobsObjects);

    //Push Job Details into Workflow
   workflow._jobsObjects = detailedJobs;

   console.log(workflow);
    res.send(workflow);


});

router.post('/readAll', async function (req, res, next) {


    //Grab all WFs out of DB
// var workflows = await findAllWorkflows();

    var workflows = await dataBaseManager.findAllWorkflows();
    //Format Workflows
    console.log(workflows);
    var formatedWorkflows = formatWorkflows(workflows);

    res.send(formatedWorkflows);


});

router.post('/readOneJob', async function (req, res, next) {

    //Grab one Job out of DB
    var job = await dataBaseManager.findOneJob(mongoose.Types.ObjectId(req.body.job_id));

    res.send(job);


});

router.post('/', async function (req, res, next) {

    //Grab one Job out of DB
    var playList = await dataBaseManager.createPlayList(mongoose.Types.ObjectId(req.body.wf_id));

    res.send(playList);


});


module.exports = router;
