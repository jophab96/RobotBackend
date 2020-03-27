var HTTPManager = require('../modules/HTTPManager').HTTPManager;
var CONFIG = require('../config/routingConfig');
var NAMING = require('../config/namingConfig');


var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';
var MOVE_BASE_NAME = 'BaseMove';
var MOVE_ARM_CARTESIAN_NAME = 'ArmCartesian';

var JOB_STATE_ACTIVE = 'active';

var workflowProgress = 0;

var socketApi = require('../modules/socketApi');
var io = socketApi.io;
const port = process.env.PORT || CONFIG.socketPort;
io.listen(port);
let x = 0;
let actJob;


httpManager = new HTTPManager();

class ChimeraManager {

    /**
     * Constructor for the Chimera Manager.
     * @constructor
     * @return {ChimeraManager} Instance of the ChimeraManager - Singleton.
     */

    constructor() {
        if (!!ChimeraManager.instance) {
            return ChimeraManager.instance;
        }

        ChimeraManager.instance = this;
        return this;
    }

    /**
     * Sets the workflow to play
     * @param {workflow} workflow
     */

    setWorkflow(workflow) {

        this.worklfow = workflow;

    }

    /**
     * gets the workflow to play
     * @return {Workflow} workflow
     */
    /**
     * @typedef Workflow
     * @type {Any}
     * @property {mongoose.Types.ObjectId} _id - unique ID of the workflow
     * @property {String} name - name of the workflow
     * @property {Date} created_at- creation date of the workflow
     * @property {Job[]} jobs - array of jobs

     */

    /**
     * @typedef Job
     * @type {Any}
     * @property {mongoose.Types.ObjectId} _id - unique ID of the job
     * @property {Number} activationTimeout - global job param

     */

    getWorkflow(){

        return this.worklfow;
    }

    /**
     * Executes the workflow which was set by the {@link ChimeraManager#setWorkflow|setWorkflow} Method.
     * Each job of the workflow is executed by the {@link ChimeraManager#executeJob|executeJob} Method.
     * @param {none} none

     */

    executeWorkflow() {
        if (x < this.worklfow.length) {
            actJob = this.worklfow[x];
            x++;
            this.executeJob(actJob);
        } else {
            x = 0;
            workflowProgress = 0;
        }
    }

    /**
     * Executes one given job.
     * The job is send to Chimera via the {@link HTTPManager#sendJob|sendJob} Method.
     * After that, the  {@link ChimeraManager#pollingJobState|pollingJobState} Method is called.
     * If the Job is finished, the workflowProgress value gets updated.
     * @param {Job} playJob

     */

    async executeJob(playJob) {

        httpManager.sendJob(this.prepareJob(playJob)).then(activeJobID => {

            this.pollingJobState(activeJobID, 10000, 500).then(result => {

                workflowProgress = workflowProgress + (100 / this.worklfow.length);
                socketApi.updateWorkflowProgress(workflowProgress);

                this.executeWorkflow();

            });
        });
    }

    /**
     * Check the state of an actual processed job.
     * A job state request is send to Chimera via {@link HTTPManager#checkJobState|checkJobState} Method.
     * After that, a Promise is returned.
     * @param {mongoose.Types.ObjectId} activeJobID
     * @param {Integer} timeout
     * @param {Integer} interval
     * @return {Promise} new Promise
     */
    pollingJobState(activeJobID, timeout, interval) {
        var endTime = Number(new Date()) + (timeout || 2000);
        interval = interval || 100;

        var checkCondition = function (resolve, reject) {

            httpManager.checkJobState(activeJobID).then(function (response) {
                if (response != JOB_STATE_ACTIVE) {
                    resolve(response);
                } else if (Number(new Date()) < endTime) {
                    setTimeout(checkCondition, interval, resolve, reject);
                } else {
                    reject(new Error('timed out '));
                }
            });
        };

        return new Promise(checkCondition);
    }

    async getAvailableJobs() {

        var availableJobs = {
            'workflows': ['GripperGripWorkflow',
                'MoveArmCartesianWorkflow',
                'GripperReleaseWorkflow',
            'NewMethodWorkflow']
        };

        console.log(availableJobs);
        return availableJobs;
    }

    /**
     * @typedef Position
     * @type {Number[]}
     * @property {Number} x - x value
     * @property {Number} y - y value
     * @property {Number} z - z value
     * @property {Number} x - x value
     * @property {Number} y - y value
     * @property {Number} z - z value
     * @property {Number} w - w value
     */
    /**
     * Mock and returns the actual arm position
     * @return {Position} basePosition
     */
     getArmPosition() {

        var armPosition = [this.num(), this.num(), this.num(), this.num(), this.num(), this.num(), this.num()];
        return armPosition;
    }

    /**
     * Sets the actual arm position
     * @param {Position} armPosition
     */
    setArmPosition(armPosition){

         this.armPosition = armPosition
    }

    /**
     * Mock and returns the actual base position
     * @return {Position} basePosition
     */
     getBasePosition() {

        var basePosition = [this.num(), this.num(), this.num(), this.num(), this.num(), this.num(), this.num()];
        return basePosition;
    }

    /**
     * Sets the actual arm position
     * @param {Position} armPosition
     */
    setBasePosition(basePosition){

        this.basePosition = basePosition
    }

    /**
     * Gets the workflowProgress
     * @return {Number} workflowProgress
     */

    getWorkflowProgress() {

        return this.workflowProgress;
    }

    /**
     * Sets the workflowProgress
     * @param {Number} workflowProgress
     */

    setWorkflowProgress(workflowProgress){

        this.workflowProgress = workflowProgress;
    }

    /**
     * Generates a random number for position mocking
     * @return {Number} randomNumber
     */

    num() {

        return Math.floor(Math.random() * 100);

    }

    /**
     * Generates the RPC request string for each single job.
     * You have to change this if you want to extend the application.
     * @param {Job} job
     * @return {String} preparedRequest
     */
    prepareJob(job) {

        var preparedRequest = {
            'jsonrpc': '2.0',
            'id': '1',
            'method': job.rpc_name,
            'params': []
        };

        switch (job.job_type) {
            case (NAMING.GRIPPER_GRIP_NAME):
                var params = [{'activation_timeout': job.activationTimeout}];
                break;

            case (NAMING.GRIPPER_RELEASE_NAME):
                var params = [{'activation_timeout': job.activationTimeout}];
                break;

            case (NAMING.MOVE_BASE_NAME):
                var params = [{'activation_timeout': job.activationTimeout, 'goalPose': job.goalPose}];
                break;

            case (NAMING.MOVE_ARM_CARTESIAN_NAME):
                var params = [{'activation_timeout': job.activationTimeout, 'goalPose': job.goalPose}];
                break;

            case (NAMING.NEW_METHOD_NAME):
                var params = [{'activation_timeout': job.activationTimeout}];
                break;
        }

        preparedRequest.params = params;
        return preparedRequest;
    }

    /**
     * Generates a sleep promise for x seconds.
     * @param {Number} ms
     * @return {Promise} newPromise
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}

exports.ChimeraManager = ChimeraManager;
