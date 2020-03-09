var HTTPManager = require('../modules/HTTPManager').HTTPManager;
var CONFIG = require('../config/routingConfig');

var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';
var MOVE_BASE_NAME = 'BaseMove';
var MOVE_ARM_CARTESIAN_NAME = 'ArmCartesian';

var JOB_STATE_ACTIVE = 'active';

var SLEEP_INTERVALL = 500;
var activeJobID;
var workflowProgress = 0;

var socketApi = require('../modules/socketApi');
var io = socketApi.io;
const port = process.env.PORT || CONFIG.socketPort;
io.listen(port);
let x = 0;
let actJob;

//const io = require('socket.io')(server);


httpManager = new HTTPManager();

class ChimeraManager {

    constructor() {
        if (!!ChimeraManager.instance) {
            return ChimeraManager.instance;
        }

        ChimeraManager.instance = this;
        return this;
    }

    //Sets Playlist

    setWorkflow(workflow) {

        this.worklfow = workflow;

    }

    //Playplaylist, sends Play Object to HTTPManager, Polling until finished

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


    async executeJob(playJob) {

        httpManager.sendJob(this.prepareJob(playJob)).then(activeJobID => {

            this.pollingJobState(activeJobID, 10000, 500).then(result => {
                workflowProgress = workflowProgress + (100 / this.worklfow.length);
                console.log('PROGRESS: ' + workflowProgress);
                socketApi.updateWorkflowProgress(workflowProgress);

                this.executeWorkflow();

            });
        });
    }


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
                'GripperReleaseWorkflow']
        };

        //this.availabeJobs = await httpManager.pullJobs();
        //delete this.availabeJobs[2];
        console.log(availableJobs);
        return availableJobs;


        //return await httpManager.pullJobs();
    }

//Mocks Arm Position
    async getArmPosition() {

        var armPosition = [this.num(), this.num(), this.num(), this.num(), this.num(), this.num(), this.num()];
        return armPosition;
    }

//Mocks Base Position
    async getBasePosition() {

        var basePosition = [this.num(), this.num(), this.num(), this.num(), this.num(), this.num(), this.num()];
        return basePosition;
    }

    getWorkflowProgress() {

        return workflowProgress;
    }

    num() {

        return Math.floor(Math.random() * 100);

    }

    prepareJob(job) {

        var preparedRequest = {
            'jsonrpc': '2.0',
            'id': '1',
            'method': job.rpc_name,
            'params': []
        };

        switch (job.job_type) {
            case (GRIPPER_GRIP_NAME):
                var params = [{'activation_timeout': job.activationTimeout}];
                break;

            case (GRIPPER_RELEASE_NAME):
                var params = [{'activation_timeout': job.activationTimeout}];
                break;

            case (MOVE_BASE_NAME):
                var params = [{'activation_timeout': job.activationTimeout, 'goalPose': job.goalPose}];
                break;

            case (MOVE_ARM_CARTESIAN_NAME):
                var params = [{'activation_timeout': job.activationTimeout, 'goalPose': job.goalPose}];
                break;
        }

        preparedRequest.params = params;
        return preparedRequest;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}

exports.ChimeraManager = ChimeraManager;
