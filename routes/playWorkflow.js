var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var adress = 'http://localhost:4000';


const Workflow = require('../models/workflow');
const GRIPPER_GRIP = require('../models/job_gripper_grip');
const GRIPPER_RELEASE = require('../models/job_gripper_release');

var jsonData;

function doPostRequest() {


    var jsonDataObj = {
        'jsonrpc': '2.0',
        'id': '1',
        'method': 'trigger_gripper_release',
        'params': [{'activation_timeout': 5}]
    };

    request.post({
        headers: {
            'user': 'intern',
            'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
        },
        url: 'http://localhost:4000',
        body: jsonData,
        json: true
    }, function (error, response, body) {
        console.log(body);
    });


    /**
     var options = {
        url: 'http://localhost:4000',
        headers: {
            'User-Agent': 'request'
        }
    };

     var text ={ json: {
            jsonrpc: "2.0",
            id: "1",
            method: "trigger_gripper_release",
            params: [{activation_timeout : 5}]
        }};


     function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info);

        }else{

            console.log(error);

        }
    }

     request.post(options, callback);
     **/
    /**
     request.post(
     adress,
     { json: {
                jsonrpc: "2.0",
                id: "1",
                method: "trigger_gripper_release",
                params: [{activation_timeout : 5}]
    }},
     function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }else{

                console.log(error);

            }
        }
     );

     **/

}

function doGripperGrip(job) {

    GRIPPER_GRIP.
    findById(job._id_job_fk)
        .exec()
        .then(specJob => {
            console.log('WE FOUND IT: ' + specJob);
            jsonData = {
                'jsonrpc': '2.0',
                'id': '1',
                'method': 'trigger_gripper_grip',
                'params': [{'activation_timeout': specJob.activationTimeout}]
            };
            doPostRequest();
        });

}

function doGripperRelease(job) {

    GRIPPER_RELEASE.
    findById(job._id_job_fk)
        .exec()
        .then(specJob => {
            console.log('WE FOUND IT: ' + specJob);
            jsonData = {
                'jsonrpc': '2.0',
                'id': '1',
                'method': 'trigger_gripper_release',
                'params': [{'activation_timeout': specJob.activationTimeout}]
            };
            doPostRequest();
        });

}

function playWorkflow(workflow) {

    for (let job of workflow.jobs) {

        switch (job.name) {

            case('trigger_gripper_grip'):
                doGripperGrip(job);
                break;
            case ('trigger_gripper_release'):
                doGripperRelease(job);
                break;

        }
    }

}


/* POST methods listing. */
router.post('/', function (req, res, next) {


    var id = mongoose.Types.ObjectId(req.body.wf_id);

    Workflow.findById(id)
        .exec()
        .then(workflow => {
            console.log(workflow);
            res.status(200).json(workflow);
            playWorkflow(workflow)
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


module.exports = router;
