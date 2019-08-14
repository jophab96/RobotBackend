var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var adress = 'http://localhost:4000';
var Worker = require('webworker-threads').Worker;
const axios = require('axios');


const Workflow = require('../models/workflow');
const GRIPPER_GRIP = require('../models/job_gripper_grip');
const GRIPPER_RELEASE = require('../models/job_gripper_release');

var jsonData;
var wf;

async function doPostRequest() {



    request.post({
        headers: {
            'user': 'intern',
            'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
        },
        url: 'http://localhost:4000',
        body: jsonData,
        json: true
    }, function (error, response, body) {
        //console.log(body);
        console.log('Started Job ID: ' + body.result.job_id);
        act_job_id = body.result.job_id;
       // playJob(wf.jobs[1]);
    });


   // return body.result.job_id;
   // console.log('Started check ID: ' + act_job_id);



    //checkJobRequest(act_job_id);

    // waitForJob();


}






const sendToServer = async url => {

    var config = {
        headers: {
            'user': 'intern',
            'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
        }
    };
    jsonData = {
        'jsonrpc': '2.0',
        'id': '1',
        'method': 'trigger_gripper_release',
        'params': [{'activation_timeout': 6}]
    };
    try {

        const response = await axios.post(adress,jsonData,config);
        const data = response.data;
        console.log(data);
        return response.data.result.job_id;


    } catch (error) {
        console.log(error);
    }
};

const checkJobState = async job_id => {


    var config = {
        headers: {
            'user': 'intern',
            'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
        }
    };

    var jsonDataObj = {
        'jsonrpc': '2.0',
        'id': '1',
        'method': 'get_workflow_progress',
        'params': [{'job_id': job_id}]
    };

    try {

        var response = await axios.post(adress,jsonDataObj,config);

        while(response.data.result.job_state == 'active'){

            console.log('WAITING, ');
            console.log(response.data);

            await sleep(500);
            response = await axios.post(adress,jsonDataObj,config);
        }
        const data = response.data;
        console.log(data);
        return response.data.result;


    } catch (error) {
        console.log(error);
    }
};






async function doGripperGrip(job) {

    GRIPPER_GRIP.findById(job._id_job_fk)
        .exec()
        .then(specJob => {
            //  console.log('WE FOUND IT: ' + specJob);
            jsonData = {
                'jsonrpc': '2.0',
                'id': '1',
                'method': 'trigger_gripper_grip',
                'params': [{'activation_timeout': specJob.activationTimeout}]
            };
            // checkJobProgress(specJob.job_id)


        });

}

async function doGripperRelease(job) {

    GRIPPER_RELEASE.findById(job._id_job_fk)
        .exec()
        .then(specJob => {
            //   console.log('WE FOUND IT: ' + specJob);
            jsonData = {
                'jsonrpc': '2.0',
                'id': '1',
                'method': 'trigger_gripper_release',
                'params': [{'activation_timeout': specJob.activationTimeout}]
            };

            //checkJobProgress(specJob.job_id)
        });


}

async function playWorkflow(workflow) {

    for (let job of workflow.jobs) {

        var a_job;
        // console.log('LOG: ' + job);

        switch (job.name) {

            case('trigger_gripper_grip'):

                console.log("START");
                await doGripperGrip(job);
                a_job =  await sendToServer();
                 await checkJobState(a_job);
                console.log("END");
                break;
            case ('trigger_gripper_release'):
                console.log("START");
                await doGripperRelease(job);
                a_job =  await sendToServer();
                await checkJobState(a_job);
                console.log("END");
                break;

        }


    }


}

async function playJob(job) {


    switch (job.name) {

        case('trigger_gripper_grip'):
            doGripperGrip(job);
            break;
        case ('trigger_gripper_release'):
            doGripperRelease(job);
            break;

    }


}

async function waitForJob(job_id) {

    while (true) {
        sleep_ms(50);


        if (checkJobRequest(job_id) != 'done') {

            console.log('WAINTING for Job : ' + job_id + ' , actState: ' + checkJobRequest(job_id));
            sleep_ms(100);
        }

    }
}

function checkJobRequest(job_id) {


    var state = "false";

    var jsonDataObj = {
        'jsonrpc': '2.0',
        'id': '1',
        'method': 'get_workflow_progress',
        'params': [{'job_id': job_id}]
    };

    request.post({
        headers: {
            'user': 'intern',
            'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
        },
        url: 'http://localhost:4000',
        body: jsonDataObj,
        json: true
    }, function (error, response, body) {


        console.log('State of Job ID: ' + job_id + ' is: '+ body.result);

        state = body.result.job_state;

    });


}


/* POST methods listing. */
router.post('/', function (req, res, next) {

   //test();

    var id = mongoose.Types.ObjectId(req.body.wf_id);

    Workflow.findById(id)
        .exec()
        .then(workflow => {
            console.log(workflow);
            res.status(200).json(workflow);
            playWorkflow(workflow);
            wf = workflow;
        })
        .catch();


    // res.send('OK');


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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = router;
