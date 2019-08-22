var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';

var GRIPPER_GRIP_RPC_NAME = 'trigger_gripper_grip';
var GRIPPER_RELEASE_RPC_NAME = 'trigger_gripper_release';

const Workflow = require('../models/workflow');
const IJob = require('../models/IJob');
const Job_GripperGrip = require('../models/IJob');
const Job_GripperRelease = require('../models/IJob');

//JSON Input: jsondata

var workflow;

function prepareJobs(inputJobs) {

    var processingJob;

    for (let job of inputJobs) {

        console.log('Preparing job:');
        console.log(job._name);

        switch (job._name) {

            case (GRIPPER_GRIP_NAME):
                processingJob = new Job_GripperGrip({
                    _id: new mongoose.Types.ObjectId(),
                    job_type: GRIPPER_GRIP_NAME,
                    activationTimeout: 11,
                    rpc_name: GRIPPER_GRIP_RPC_NAME
                });
                break;
            case (GRIPPER_RELEASE_NAME):
                processingJob = new Job_GripperRelease({
                    _id: new mongoose.Types.ObjectId(),
                    job_type: GRIPPER_RELEASE_NAME,
                    activationTimeout: 14,
                    rpc_name: GRIPPER_RELEASE_RPC_NAME

                });
                break;
            default:
                break;

        }

        pushJob(processingJob);
    }

}

function pushJob(job) {

    workflow.jobs.push({_id_job_fk: job._id, job_type: job.job_type});
    job.save().then(result => {

        console.log(result);
        return result._id;
    });



}

function saveWorkflow() {

    workflow.save().then(result => {
        console.log(result);
        return result._id;
    });


}

function createWorkflow(created_at) {

    workflow = new Workflow({
        _id: new mongoose.Types.ObjectId(),
        created_at: created_at,
    });

    return workflow._id;

}

 function printAllWorkflows(){

  Workflow.find()
        .exec()
        .then(doc => {
        console.log(doc);

        })
        .catch();

}

/* POST methods listing. */
router.post('/', function (req, res, next) {

    let inputWorkflow = JSON.parse(req.body.jsondata); // string to generic object first

    deletWorkflow();

    createWorkflow();

    // let inputWorkflow = req.body.jsondata;

    var processingWorkflowID = createWorkflow(inputWorkflow._created_at);

    prepareJobs(inputWorkflow._jobsObjects);

    saveWorkflow();

    res.send(processingWorkflowID);


});

/* GET workflow listing. */
router.get('/', function (req, res, next) {


    printAllWorkflows();
    res.send('OK');

});


module.exports = router;
