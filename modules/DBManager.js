var mongoose = require('mongoose');
var NAMING = require('../config/namingConfig');

const Workflow = require('../db-models/workflow');

const IJob = require('../db-models/IJob');
const Job_GripperGrip = require('../db-models/GripperGripJob');
const Job_GripperRelease = require('../db-models/GripperReleaseJob');
const Job_MoveBase = require('../db-models/MoveBaseJob');
const Job_MoveArmCartesian = require('../db-models/MoveArmCartesianJob');

/** Insert require for extending new method.**/
const Job_NewMethod = require('../db-models/NewMethodJob');



class DBManager {

    /**
     * Constructor for the Database Manager.
     * @constructor
     * @return {DBManager} - Instance of the DBManager - Singleton.
     */
    constructor() {
        if (!!DBManager.instance) {
            return DBManager.instance;
        }

        DBManager.instance = this;

        return this;
    }

    /**
     * Opens the DB Manager.
     */
    open() {
        this.workflow = null;

        console.log('Opened the DBManager');
    }

    /**
     * Reads jobid of every job in the array und creates a array with all the jobs and their detailed information in it.
     * @param {Job[]} - jobs  Array of Jobs without detailed job information
     * @return {Job[]} - Array of Jobs with detailed job information
     */

    async createJobList(jobs) {

        var j = [];

        for (let job of jobs) {

            var dbJob = await this.findOneJob(mongoose.Types.ObjectId(job._id_job_fk));

            switch (dbJob.job_type) {

                case (NAMING.GRIPPER_GRIP_NAME):

                    var listjob = {_id: dbJob._id, _name: dbJob.job_type, _activationTimeout: dbJob.activationTimeout};
                    j.push(listjob);
                    break;

                case (NAMING.GRIPPER_RELEASE_NAME):
                    var listjob = {_id: dbJob._id, _name: dbJob.job_type, _activationTimeout: dbJob.activationTimeout};
                    j.push(listjob);
                    break;

                case (NAMING.MOVE_BASE_NAME):
                    var listjob = {
                        _id: dbJob._id,
                        _name: dbJob.job_type,
                        _activationTimeout: dbJob.activationTimeout,
                        _goalPose: dbJob.goalPose
                    };
                    j.push(listjob);
                    break;

                case (NAMING.MOVE_ARM_CARTESIAN_NAME):
                    var listjob = {
                        _id: dbJob._id,
                        _name: dbJob.job_type,
                        _activationTimeout: dbJob.activationTimeout,
                        _goalPose: dbJob.goalPose
                    };
                    j.push(listjob);
                    break;
                /** Insert case for extending new method.**/

                case (NAMING.NEW_METHOD_NAME):
                    var listjob = {
                        _id: dbJob._id,
                        _name: dbJob.job_type,
                        _activationTimeout: dbJob.activationTimeout,
                        _goalPose: dbJob.goalPose
                    };
                    j.push(listjob);
                    break;
            }
        }

        return j;
    }

    /**
     * Reads workflow out of the Database and creates an array of all jobs with detailed job information.
     * @param {mongoose.Types.ObjectId} - ID of the workflow
     * @return {Job[]} - Array of Jobs with detailed job information
     */

    async createPlayList(id) {

        var workflowID = mongoose.Types.ObjectId(id);
        var playWorkflow = await this.findWorkflow(workflowID);
        var playJob;
        var playList = [];

        for (let job of playWorkflow.jobs) {
            playJob = await this.findOneJob(mongoose.Types.ObjectId(job._id_job_fk));
            playList.push(playJob);
        }
        return playList;

    }

    /**
     * Reads workflow out of the Database.
     * @param {mongoose.Types.ObjectId} - ID of the workflow
     * @return {Workflow} - Workflow with specified ID.
     */


    findWorkflow(workflowID) {

        return Workflow.findById(workflowID)
            .exec()
            .then(workflow => {
                return workflow;
            })
            .catch();
    }

    /**
     * Reads all workflows out of the Database.
     * @return {Workflow[]} - Array of all workflows.
     */
    findAllWorkflows() {

        return Workflow.find()
            .exec()
            .then(doc => {
                return doc;
            })
            .catch();
    }

    /**
     * Reads workflow out of the Database.
     * @param {mongoose.Types.ObjectId} - ID of the workflow
     * @return {Workflow} - Workflow in a different Format.
     */
    async findOneMappedWorkflow(id) {

        var workFlowID = mongoose.Types.ObjectId(id);

        return Workflow.findById(workFlowID)
            .exec()
            .then(workflow => {
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

    /**
     * Reads job out of the Database.
     * @param {mongoose.Types.ObjectId} - ID of the job
     * @return {Job} - Job with specified ID.
     */

    findOneJob(id) {

        var jobID = mongoose.Types.ObjectId(id);

        console.log(jobID);

        return IJob.findById(jobID)
            .exec()
            .then(specJob => {
                console.log(specJob);
                return specJob;

            });

    };

    /**
     * Updates an specified Workflow.
     * @param {Workflow} - the updated Workflow that should replace the old one.
     *
     */
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

    /**
     * Deletes one  specified workflow.
     * @param {mongoose.Types.ObjectId} - ID of the workflow
     *
     */
    deleteWorkflow(workflowID) {

        Workflow.remove({_id: workflowID}, function (err) {
            if (!err) {
                console.log("Success")
            } else {
                console.log("Error")
            }
        });
    }



    /**
     * Deletes all workflows and jobs. Cleans the DB.
     */

    deleteAllWorkflows() {

        Workflow.remove({}, function (err) {
            console.log('collection removed')
        });

        IJob.remove({}, function (err) {
            console.log('collection removed')
        });
    }

    /**
     * Deletes all jobs of an given workflow.
     * @param {Workflow} - the workflow..
     *
     */
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

    /**
     * Creates a new workflow.
     * @param {String} - Name of the new workflow.
     *
     */
    createWorkflow(name) {

        this.workflow = new Workflow({
            _id: new mongoose.Types.ObjectId(),
            name: name,
        });

        return this.workflow._id;
    }

    /**
     * Add jobs to the actual processed workflow. In this Method the DBManager assigns the right DB schema to each single Job.
     * In the case of an extension or in the case of adding new function to this project, you have to add the new Job Types here.
     * @param {Job[]} - Jobs Array of Jobs.
     * @return {mongoose.Types.ObjectId} - ID of the processed workflow.
     *
     */
    addJobs(inputJobs) {

        var processingJob;

        for (let job of inputJobs) {
            switch (job._name) {

                case (NAMING.GRIPPER_GRIP_NAME):
                    processingJob = new Job_GripperGrip({
                        _id: new mongoose.Types.ObjectId(),
                        job_type: NAMING.GRIPPER_GRIP_NAME,
                        activationTimeout: job._activationTimeout,
                    });
                    break;
                case (NAMING.GRIPPER_RELEASE_NAME):
                    processingJob = new Job_GripperRelease({
                        _id: new mongoose.Types.ObjectId(),
                        job_type: NAMING.GRIPPER_RELEASE_NAME,
                        activationTimeout: job._activationTimeout,

                    });
                    break;
                case (NAMING.MOVE_BASE_NAME):
                    processingJob = new Job_MoveBase({
                        _id: new mongoose.Types.ObjectId(),
                        job_type: NAMING.MOVE_BASE_NAME,
                        activationTimeout: job._activationTimeout,
                        goalPose: job._goalPose,

                    });
                    break;
                case (NAMING.MOVE_ARM_CARTESIAN_NAME):
                    processingJob = new Job_MoveArmCartesian({
                        _id: new mongoose.Types.ObjectId(),
                        job_type: NAMING.MOVE_ARM_CARTESIAN_NAME,
                        activationTimeout: job._activationTimeout,
                        goalPose: job._goalPose,

                    });
                    break;
                /** Insert case for extending new method.**/
                case (NAMING.NEW_METHOD_NAME):
                    processingJob = new Job_NewMethod({
                        _id: new mongoose.Types.ObjectId(),
                        job_type: NAMING.MOVE_ARM_CARTESIAN_NAME,
                        activationTimeout: job._activationTimeout,
                        goalPose: job._goalPose,

                    });
                default:
                    break;

            }

            this.workflow.jobs.push({_id_job_fk: processingJob._id, job_type: processingJob.job_type});

            processingJob.save().then(result => {

                return result._id;
            });
        }

    }

    /**
     * Saves the actual results.
     * @return {mongoose.Types.ObjectId} - ID of the saved workflow.
     *
     */

    close() {

        this.workflow.save().then(result => {
            console.log(result);
            return result._id;
        });


    }


}

exports.DBManager = DBManager;
