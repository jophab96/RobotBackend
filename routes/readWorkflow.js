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


async function findOneWorkflow(id) {


    return Workflow.findById(id)
        .exec()
        .then(workflow => {
            console.log(workflow);

            //Some Mapping
            var wf = {
                _id: workflow._id,
                _name: workflow.name,
                _created_at: workflow.created_at,
                _jobsObjects: workflow.jobs
            };
            return wf;
        })
        .catch();


}

async function createJobList(jobs) {

    var j = [];

    for (let job of jobs) {

        var dbJob = await findOneJob(job._id_job_fk);

        console.log(job._id_job_fk);

        switch (dbJob.job_type) {


            case (GRIPPER_GRIP_NAME):
                var listjob = {_id: dbJob._id, _name: dbJob.job_type, _activationTimeout: dbJob.activationTimeout};
                j.push(listjob);
                break;

            case (GRIPPER_RELEASE_NAME):
                var listjob = {_id: dbJob._id, _name: dbJob.job_type, _activationTimeout: dbJob.activationTimeout};
                j.push(listjob);
                break;



        }

    }

    return j;

}

function findAllWorkflows() {

    return Workflow.find()
        .exec()
        .then(workflows => {
            return workflows;
        })
        .catch();


}

function findOneJob(id) {

    console.log(id);

    return IJob.findById(id)
        .exec()
        .then(specJob => {
            return specJob;
        });

};

function formatWorkflows(workflows){

    var wf_list = [];

    for (let workflow of workflows) {

        var wf = {_id: workflow._id, _name: workflow.name, _created_at: workflow.created_at};
        wf_list.push(wf);
    }

    return wf_list;
}


/* POST methods listing. */
// URL : /readWorkflow/readOne
// Input: wf_id


router.post('/readOne', async function (req, res, next) {

    //Get Workflow out of DB (Key : wf:id)
    var workflow = await findOneWorkflow(mongoose.Types.ObjectId(req.body.wf_id));

    console.log(workflow);
    //Get Job Details out ob DB (with Jobs FK of WF)
    var detailedJobs = await createJobList(workflow._jobsObjects);

    //Push Job Details into Workflow
    workflow._jobsObjects = detailedJobs;

    res.send(workflow);


});

router.post('/readAll', async function (req, res, next) {


    //Grab all WFs out of DB
    var workflows = await findAllWorkflows();

    //Format Workflows
    var formatedWorkflows = formatWorkflows(workflows);

    res.send(formatedWorkflows);


});

router.post('/readOneJob', async function (req, res, next) {

    //Grab one Job out of DB
    var job = await findOneJob(mongoose.Types.ObjectId(req.body.job_id));

    res.send(job);


});




module.exports = router;
