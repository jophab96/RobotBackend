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
