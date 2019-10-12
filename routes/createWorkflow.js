var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var DBManager = require('../models/DBManager').DBManager;

var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';
var MOVE_BASE_NAME = 'MoveBase';
var MOVE_ARM_CARTESIAN_NAME = 'MoveArmCartesian';

var GRIPPER_GRIP_RPC_NAME = 'trigger_gripper_grip';
var GRIPPER_RELEASE_RPC_NAME = 'trigger_gripper_release';
var MOVE_BASE_RPC_NAME = 'trigger_move_base';
var MOVE_ARM_CARTESIAN_RPC_NAME = 'trigger_move_arm_cartesian';

const Workflow = require('../models/workflow');
const IJob = require('../models/IJob');
const Job_GripperGrip = require('../models/IJob');
const Job_GripperRelease = require('../models/IJob');
const Job_MoveBase = require('../models/IJob');
const Job_MoveArmCartesian = require('../models/IJob');

const dataBaseManager = new DBManager();

//JSON Input: jsondata

var workflow;
var updateJobsArray= [];

function saveJobs(inputJobs) {

    var processingJob;

    for (let job of inputJobs) {

        switch (job._name) {

            case (GRIPPER_GRIP_NAME):
                processingJob = new Job_GripperGrip({
                    _id: new mongoose.Types.ObjectId(),
                    job_type: GRIPPER_GRIP_NAME,
                    activationTimeout: job._activationTimeout,
                    rpc_name: GRIPPER_GRIP_RPC_NAME
                });
                break;
            case (GRIPPER_RELEASE_NAME):
                processingJob = new Job_GripperRelease({
                    _id: new mongoose.Types.ObjectId(),
                    job_type: GRIPPER_RELEASE_NAME,
                    activationTimeout: job._activationTimeout,
                    rpc_name: GRIPPER_RELEASE_RPC_NAME

                });
                break;
            case (MOVE_BASE_NAME):
                processingJob = new Job_MoveBase({
                    _id: new mongoose.Types.ObjectId(),
                    job_type: MOVE_BASE_NAME,
                    activationTimeout: job._activationTimeout,
                    goalPose: job._goalPose,
                    rpc_name: MOVE_BASE_RPC_NAME

                });
                break;
            case (MOVE_ARM_CARTESIAN_NAME):
                processingJob = new Job_MoveArmCartesian({
                    _id: new mongoose.Types.ObjectId(),
                    job_type: MOVE_ARM_CARTESIAN_NAME,
                    activationTimeout: job._activationTimeout,
                    goalPose: job._goalPose,
                    rpc_name: MOVE_ARM_CARTESIAN_RPC_NAME

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

function createWorkflow(name) {

    workflow = new Workflow({
        _id: new mongoose.Types.ObjectId(),
        name: name,
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

function deleteJobs(workflow) {

    for (let job of workflow.jobs) {

        IJob.deleteMany({ _id: job._id_job_fk }, function(err) {
            if (!err) {
                console.log("Success")
            }
            else {
                console.log("Error")
            }
        });

    }
}

function findWorkflow(workflowID) {

    return Workflow.findById(workflowID)
        .exec()
        .then(workflow => {
            console.log(workflow);
            return workflow;
        })
        .catch();


}

function deleteWorkflow(workflowID){

    Workflow.remove({ _id: workflowID }, function(err) {
        if (!err) {
            console.log("Success")
        }
        else {
            console.log("Error")
        }
    });

};

router.post('/', async function (req, res, next) {

    //let inputWorkflow = JSON.parse(req.body.jsondata); // string to generic object first

    /**
    //Read Workflow Input out of Body
    let inputWorkflow = req.body.jsondata;

    //Saves Workflow into DB and returns WF-ID
    var processingWorkflowID = createWorkflow(inputWorkflow._name);



    saveJobs(inputWorkflow._jobsObjects);

    saveWorkflow();

    res.send(processingWorkflowID);
**/


    let inputWorkflow = req.body.jsondata;

    dataBaseManager.open()
    var processingWorkflowID =dataBaseManager.createWorkflow(inputWorkflow._name);
    dataBaseManager.addJobs(inputWorkflow._jobsObjects);
    dataBaseManager.close();
    res.send(processingWorkflowID);





});

router.post('/delteWorkflow', function (req, res, next) {

    //let inputWorkflow = JSON.parse(req.body.jsondata); // string to generic object first
/**
    let wfId = req.body.wf_id;

    deleteWorkflow(wfId);

    res.send(wfId);

**/


    let wfId = req.body.wf_id;

    dataBaseManager.deleteWorkflow(wfId);

    res.send(wfId);

});

router.post('/updateWorkflow', async function (req, res, next) {

    //let inputWorkflow = JSON.parse(req.body.jsondata); // string to generic object first

    let inputWorkflow = req.body.jsondata;

    console.log(inputWorkflow);

    //Grab Worfklow out of DB

     await dataBaseManager.updateWorkflow(inputWorkflow);

    /**
    workflow = await findWorkflow(inputWorkflow._id);

    //Delete all WF Jobs from DB
    await deleteJobs(workflow);


    workflow.update({ $set: {'jobs': [] } },function(err) {
        if (!err) {
            console.log("Success")
        }
        else {
            console.log("Error")
        }
    });

    //save Jobs to Workflow
    saveJobs(inputWorkflow._jobsObjects);

    //Save WF
    saveWorkflow();
**/

    res.send(workflow._id);




});

router.post('/deleteAll', async function (req, res, next) {

    Workflow.remove({}, function(err) {
        console.log('collection removed')
    });

    IJob.remove({}, function(err) {
        console.log('collection removed')
    });

});

router.get('/', function (req, res, next) {


    printAllWorkflows();
    res.send('OK');

});


module.exports = router;
