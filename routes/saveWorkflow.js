var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Method = require('../models/method');
const Workflow = require('../models/workflow');
const GRIPPER_GRIP = require('../models/job_gripper_grip');
const GRIPPER_RELEASE = require('../models/job_gripper_release');

const Job = require('../models/job');
const Work = require('../models/work')

var job;
var workflow;
var work;


function saveWorkflow() {

    workflow.save().then(result => {
        console.log(result);
        return result._id;
    });


}

function createWorkflow(created_at) {

    workflow = new Workflow({
        _id: new mongoose.Types.ObjectId(),
        created_at: created_at,
    });

    return workflow._id;

}

function createGripperGripJob(activationTimeout) {

    const gripper_grip = new GRIPPER_GRIP({
        _id: new mongoose.Types.ObjectId(),
        activationTimeout: activationTimeout
    });

    workflow.jobs.push({_id_job_fk: gripper_grip._id, name: 'trigger_gripper_grip'})

    gripper_grip.save().then(result => {
        console.log('New GRIPPER JOB');
        console.log(result);
        return result._id;
    });

}

function createGripperReleaseJob(activationTimeout) {

    const gripper_release = new GRIPPER_RELEASE({
        _id: new mongoose.Types.ObjectId(),
        activationTimeout: activationTimeout
    });

    workflow.jobs.push({_id_job_fk: gripper_release._id, name: 'trigger_gripper_release'})

    gripper_release.save().then(result => {
        console.log('New GRIPPER RELEASE JOB');
        console.log(result);
        return result._id;
    });

}


/* POST methods listing. */
router.post('/', function (req, res, next) {

    console.log(req.body.jsondata);

    //let inputWorkflow = JSON.parse(req.body.jsondata); // string to generic object first

    let inputWorkflow = req.body.jsondata;

    console.log(inputWorkflow);

    var wf_id = createWorkflow(inputWorkflow._created_at);

    for (let job of inputWorkflow._jobsObjects) {

        console.log('Working on: ' + job._name);

        switch (job._name) {
            case ( 'GripperGrip'):
                createGripperGripJob(10);
                break;
            case ('GripperRelease'):
                createGripperReleaseJob(10);
                break;
            default:
                break;

        }

    }

    saveWorkflow();


    res.send(wf_id);


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
