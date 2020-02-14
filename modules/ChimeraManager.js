var HTTPManager = require('../modules/HTTPManager').HTTPManager;

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
const port = process.env.PORT || 3030;
io.listen(port);
let jobsCount = 0;
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

    setPlayList(playList) {

        this.playList = playList;

    }

    //Spinner HERE!
    //Playplaylist, sends Play Object to HTTPManager, Polling until finished
    async playPlayList() {

        this.executeJobList();
    }


    executeJobList() {
        if (x < this.playList.length) {
            actJob = this.playList[x];
            x++;
            this.executeJob(actJob);
        } else {
            x = 0;
            workflowProgress = 0;
        }
    }


    async executeJob(playJob) {

        httpManager.sendJob(this.prepareJob(playJob)).then(activeJobID => {

            this.poll(activeJobID, 10000, 500).then(result => {
                workflowProgress = workflowProgress + (100 / this.playList.length);
                console.log('PROGRESS: ' + workflowProgress);
                socketApi.updateWorkflowProgress(workflowProgress);

                this.executeJobList();

            });
        });
    }


    poll(activeJobID, timeout, interval) {
        var endTime = Number(new Date()) + (timeout || 2000);
        interval = interval || 100;

        var checkCondition = function (resolve, reject) {

            httpManager.checkJobState(activeJobID).then(function (response) {
                // If the condition is met, we're done!
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

        return await httpManager.pullJobs();
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
