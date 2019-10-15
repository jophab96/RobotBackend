var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var DBManager = require('../modules/DBManager').DBManager;

var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';
var MOVE_BASE_NAME = 'MoveBase';
var MOVE_ARM_CARTESIAN_NAME = 'MoveArmCartesian';

var GRIPPER_GRIP_RPC_NAME = 'trigger_gripper_grip';
var GRIPPER_RELEASE_RPC_NAME = 'trigger_gripper_release';
var MOVE_BASE_RPC_NAME = 'trigger_move_base';
var MOVE_ARM_CARTESIAN_RPC_NAME = 'trigger_move_arm_cartesian';

const Workflow = require('../db-models/workflow');
const IJob = require('../db-models/IJob');
const Job_GripperGrip = require('../db-models/IJob');
const Job_GripperRelease = require('../db-models/IJob');
const Job_MoveBase = require('../db-models/IJob');
const Job_MoveArmCartesian = require('../db-models/IJob');

const dataBaseManager = new DBManager();

//JSON Input: jsondata

var workflow;
var updateJobsArray= [];






router.post('/', async function (req, res, next) {



    let inputWorkflow = req.body.jsondata;

    dataBaseManager.open()
    var processingWorkflowID =dataBaseManager.createWorkflow(inputWorkflow._name);
    console.log('input');
    console.log(inputWorkflow._jobsObjects);
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
