var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var URL = 'http://localhost:4000';
const axios = require('axios');

var SLEEP_INTERVALL = 500;

var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';
var MOVE_BASE_NAME = 'MoveBase';
var MOVE_ARM_CARTESIAN_NAME = 'MoveArmCartesian';

var RPC_HEADER = {
    headers: {
        'user': 'intern',
        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
    }
};

const Workflow = require('../db-models/workflow');
const IJob = require('../db-models/IJob');
const Job_GripperGrip = require('../db-models/IJob');
const Job_GripperRelease = require('../db-models/IJob');

var DBManager = require('../modules/DBManager').DBManager;
var ChimeraManager = require('../modules/ChimeraManager').ChimeraManager;


const dataBaseManager = new DBManager();
const chimeraMng = new ChimeraManager();



function prepareJob(job) {

    var preparedRequest = {
        'jsonrpc': '2.0',
        'id': '1',
        'method': job.rpc_name,
        'params': []
    };

    switch (job.job_type) {
        case (GRIPPER_GRIP_NAME):
            var params = [{'activation_timeout': job.activationTimeout}];
            break;

        case (GRIPPER_RELEASE_NAME):
            var params = [{'activation_timeout': job.activationTimeout}];
            break;

        case (MOVE_BASE_NAME):
            var params = [{'activation_timeout': job.activationTimeout,'goalPose':job.goalPose}];
            break;

        case (MOVE_ARM_CARTESIAN_NAME):
            var params = [{'activation_timeout': job.activationTimeout,'goalPose':job.goalPose}];
            break;
    }


    preparedRequest.params = params;

    return preparedRequest;
}

const sendToServer = async jsonData => {

    try {

        console.log('JSON DATA TO SEND');
        console.log(jsonData);

        const response = await axios.post(URL, jsonData, RPC_HEADER);
        return response.data.result.job_id;

    } catch (error) {
        console.log(error);
    }
};

const checkJobState = async jobID => {

    var jsonDataObj = {
        'jsonrpc': '2.0',
        'id': '1',
        'method': 'get_workflow_progress',
        'params': [{'job_id': jobID}]
    };

    try {

        var response = await axios.post(URL, jsonDataObj, RPC_HEADER);

        while (response.data.result.job_state == 'active') {

            console.log('WAITING, ');
            console.log(response.data);

            await sleep(SLEEP_INTERVALL);
            response = await axios.post(URL, jsonDataObj, RPC_HEADER);
        }
        const data = response.data;
        console.log(data);
        return response.data.result;


    } catch (error) {
        console.log(error);
    }
};

async function playWorkflow(workflow) {

    var playJob;
    var preparedString;
    var activeJobID;

    for (let job of workflow.jobs) {
        //Grab out the detailed Job of the DB
        playJob = await findOneJob(job._id_job_fk);
        //Transform Job into jsonString
        preparedString = prepareJob(playJob);
        //Send job to server
        activeJobID = await sendToServer(preparedString);
        //Waits until job is finished
        await checkJobState(activeJobID);
    }


}


function findOneJob(id) {

    return IJob.findById(id)
        .exec()
        .then(specJob => {
            return specJob;
        });

};

function findWorkflow(id) {

    return Workflow.findById(id)
        .exec()
        .then(workflow => {
            console.log(workflow);
            return workflow;
        })
        .catch();


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/* POST methods listing. */
router.post('/', async function (req, res, next) {


    var workflowID = req.body.wf_id;
    var playList = await dataBaseManager.createPlayList(workflowID);


    console.log('FINAL PLAYLIST');
    console.log(playList);
    chimeraMng.play(playList);


    var result = new Object();
    result.wf_id = workflowID;

    res.send(result);
});

/* GET workflow listing. */
router.get('/', function (req, res, next) {

    Workflow.find()
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch();

});


module.exports = router;
