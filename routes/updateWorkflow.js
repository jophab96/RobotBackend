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


router.post('/', async function (req, res, next) {

    let inputWorkflow = req.body.jsondata;
    await dataBaseManager.updateWorkflow(inputWorkflow);


    var result = new Object();
    result.wf_id = inputWorkflow._id;

    res.send(result);


});




module.exports = router;
