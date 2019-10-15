var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var URL = 'http://localhost:4000';
const axios = require('axios');

var Job = require('../models/Job').Job;
var ChimeraManager = require('../modules/ChimeraManager').ChimeraManager;

var GripperGripJob = require('../db-models/GripperGripJob').GripperGripJob;

var SLEEP_INTERVALL = 500;

var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';

var RPC_HEADER = {
    headers: {
        'user': 'intern',
        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
    }
};


const chimeraMng = new ChimeraManager();

const Workflow = require('../db-models/workflow');


const sendToServer = async jsonData => {

    try {

        console.log('JSON DATA TO SEND');
        console.log(jsonData);

        const response = await axios.post(URL, jsonData, RPC_HEADER);
        return response.data.result;

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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function num(){

    return  Math.floor(Math.random() * 100);

}

async function  getAvailableJobs(){

    var preparedRequest = {
        'jsonrpc': '2.0',
        'id': '1',
        'method': 'get_available_workflows',
        'params': [{}]
    };

    return await sendToServer(preparedRequest);

}

async function getArmPosition(){

    var armPosition = [num(), num(),num(),num(),num(),num(),num(),num()];
    return armPosition;
}

async function getBasePosition(){

   // var basePosition = {x1:num(), y1:num(), z1:num(), x2:num(), y2:num() , z2:num(), w:num()};
    var basePosition = [num(), num(),num(),num(),num(),num(),num(),num()];
    return basePosition;
}

/* POST methods listing. */
router.post('/getAvailableJobs', async function (req, res, next) {


    res.send( await chimeraMng.getAvailableJobs());


});

router.post('/getArmPosition', async function (req, res, next) {


    res.send( await chimeraMng.getArmPosition());


});

router.post('/getBasePosition', async function (req, res, next) {


    res.send( await chimeraMng.getBasePosition());


});


router.post('/test', async function (req, res, next) {






    res.send('ok');


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
