var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var URL = 'http://localhost:4000';
const axios = require('axios');

var SLEEP_INTERVALL = 500;

var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';

var RPC_HEADER = {
    headers: {
        'user': 'intern',
        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
    }
};

const Workflow = require('../models/workflow');
const IJob = require('../models/IJob');
const Job_GripperGrip = require('../models/IJob');
const Job_GripperRelease = require('../models/IJob');




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

    for (let job of workflow.jobs) {

        var activeJobID;
        var jsonData;

        jsonData = await findJob(job);
        activeJobID = await sendToServer(jsonData);
        await checkJobState(activeJobID);
    }


}


function findOneWorkflow(id) {

    return Workflow.findById(id)
        .exec()
        .then(workflow => {
            console.log(workflow);
            return workflow;
        })
        .catch();


}

function findAllWorkflows() {

    return Workflow.find()
        .exec()
        .then(workflows => {
            return workflows;
        })
        .catch();
}

function findOneJob(id){

    console.log('IUD:' + id);
    return IJob.findById(id)
        .exec()
        .then(specJob => {
            return specJob;
        });

};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/* POST methods listing. */
// URL : /readWorkflow/readOne
// Input: wf_id

router.post('/readOne', async function (req, res, next) {

    var workflow = await findOneWorkflow(mongoose.Types.ObjectId(req.body.wf_id));
    res.send(workflow);


});

router.post('/readAll', async function (req, res, next) {

    var workflows = await findAllWorkflows();
    res.send(workflows);


});

router.post('/readOneJob', async function (req, res, next) {

    var workflows = await findOneJob(mongoose.Types.ObjectId(req.body.job_id));
    res.send(workflows);


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
