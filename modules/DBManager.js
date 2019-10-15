var mongoose = require('mongoose');
//const Definitions = require('../bin/definitions').Definitions;

const Workflow = require('../db-models/workflow');

/**
const IJob = require('../models/IJob');
const Job_GripperGrip = require('../models/IJob');
const Job_GripperRelease = require('../models/IJob');
const Job_MoveBase = require('../models/IJob');
const Job_MoveArmCartesian = require('../models/IJob');

 **/
const IJob = require('../db-models/IJob');
const Job_GripperGrip = require ('../db-models/GripperGripJob');
const Job_GripperRelease =  require ('../db-models/GripperReleaseJob');
const Job_MoveBase = require('../db-models/MoveBaseJob');
const Job_MoveArmCartesian = require('../db-models/MoveArmCartesianJob');



var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';
var MOVE_BASE_NAME = 'BaseMove';
var MOVE_ARM_CARTESIAN_NAME = 'ArmCartesian';

var GRIPPER_GRIP_RPC_NAME = 'trigger_gripper_grip';
var GRIPPER_RELEASE_RPC_NAME = 'trigger_gripper_release';
var MOVE_BASE_RPC_NAME = 'trigger_move_base';
var MOVE_ARM_CARTESIAN_RPC_NAME = 'trigger_move_arm_cartesian';

class DBManager {


    constructor() {
        if (!!DBManager.instance) {
            return DBManager.instance;
        }

        DBManager.instance = this;

        return this;
    }


    open() {
        this.workflow = null;

        console.log('Opened the DBManager');

    }


   async createPlayList(id){

        var workflowID  = mongoose.Types.ObjectId(id);
        var playWorkflow = await this.findWorkflow(workflowID);
        var playJob;
        var playList=[];


        for (let job of playWorkflow.jobs) {
            //Grab out the detailed Job of the DB
            playJob = await this.findOneJob(mongoose.Types.ObjectId(job._id_job_fk));
            console.log('playjob');
            console.log(playJob);
            playList.push(playJob);
        }


        console.log(playList);

        return playList;

    }

    findWorkflow(workflowID) {

        return Workflow.findById(workflowID)
            .exec()
            .then(workflow => {
                console.log('Logging WF');
                console.log(workflow);
                return workflow;
            })
            .catch();


    }

    findAllWorkflows() {

       return Workflow.find()
            .exec()
            .then(doc => {
                return doc;

            })
            .catch();

    }

    //with mapping
    async findOneMappedWorkflow(id) {


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

    findOneJob(id) {

        console.log(id);

        return IJob.findById(id)
            .exec()
            .then(specJob => {
                console.log(specJob);
                return specJob;

            });

    };


    async updateWorkflow(inputWorkflow) {

        this.workflow = await this.findWorkflow(inputWorkflow._id);


        //Delete all WF Jobs from DB
        await this.deleteJobs(this.workflow);


        this.workflow.update({$set: {'jobs': []}}, function (err) {
            if (!err) {
                console.log("Success")
            } else {
                console.log("Error")
            }
        });

        //save Jobs to Workflow
        this.addJobs(inputWorkflow._jobsObjects);

        //Save WF
        this.close();

    }

    deleteWorkflow(workflowID) {

        Workflow.remove({_id: workflowID}, function (err) {
            if (!err) {
                console.log("Success")
            } else {
                console.log("Error")
            }
        });
    }

    deleteAllWorkflows() {

        Workflow.remove({}, function (err) {
            console.log('collection removed')
        });

        IJob.remove({}, function (err) {
            console.log('collection removed')
        });
    }


    deleteJobs(workflow) {

        for (let job of workflow.jobs) {

            IJob.deleteMany({_id: job._id_job_fk}, function (err) {
                if (!err) {
                    console.log("Success")
                } else {
                    console.log("Error")
                }
            });

        }
    }


    createWorkflow(name) {

        this.workflow = new Workflow({
            _id: new mongoose.Types.ObjectId(),
            name: name,
        });

        console.log('Created Workflow in DBM');
        console.log(this.workflow._id);

        return this.workflow._id;
    }

    addJobs(inputJobs) {

        var processingJob;

        for (let job of inputJobs) {


            console.log(job._name);
            switch (job._name) {

                case (GRIPPER_GRIP_NAME):
                    processingJob = new Job_GripperGrip({
                        _id: new mongoose.Types.ObjectId(),
                        job_type: GRIPPER_GRIP_NAME,
                        activationTimeout: job._activationTimeout,
                       // rpc_name: GRIPPER_GRIP_RPC_NAME
                    });
                    break;
                case (GRIPPER_RELEASE_NAME):
                    processingJob = new Job_GripperRelease({
                        _id: new mongoose.Types.ObjectId(),
                        job_type: GRIPPER_RELEASE_NAME,
                        activationTimeout: job._activationTimeout,
                       // rpc_name: GRIPPER_RELEASE_RPC_NAME

                    });
                    break;
                case (MOVE_BASE_NAME):
                    processingJob = new Job_MoveBase({
                        _id: new mongoose.Types.ObjectId(),
                        job_type: MOVE_BASE_NAME,
                        activationTimeout: job._activationTimeout,
                        goalPose: job._goalPose,
                       // rpc_name: MOVE_BASE_RPC_NAME

                    });
                    break;
                case (MOVE_ARM_CARTESIAN_NAME):
                    processingJob = new Job_MoveArmCartesian({
                        _id: new mongoose.Types.ObjectId(),
                        job_type: MOVE_ARM_CARTESIAN_NAME,
                        activationTimeout: job._activationTimeout,
                        goalPose: job._goalPose,
                       // rpc_name: MOVE_ARM_CARTESIAN_RPC_NAME

                    });
                    break;
                default:
                    break;

            }

            this.workflow.jobs.push({_id_job_fk: processingJob._id, job_type: processingJob.job_type});

            processingJob.save().then(result => {

                console.log(result);
                return result._id;
            });
        }

    }




    close() {

        this.workflow.save().then(result => {
            console.log(result);
            return result._id;
        });


    }


}

exports.DBManager = DBManager;
