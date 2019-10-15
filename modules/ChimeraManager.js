const axios = require('axios');

//const Definitions = require('../bin/definitions').Definitions;

var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';
var MOVE_BASE_NAME = 'BaseMove';
var MOVE_ARM_CARTESIAN_NAME = 'ArmCartesian';

var GRIPPER_GRIP_RPC_NAME = 'trigger_gripper_grip';
var GRIPPER_RELEASE_RPC_NAME = 'trigger_gripper_release';
var MOVE_BASE_RPC_NAME = 'trigger_move_base';
var MOVE_ARM_CARTESIAN_RPC_NAME = 'trigger_move_arm_cartesian';

var RPC_HEADER = {
    headers: {
        'user': 'intern',
        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2JvdElkIjoiY2hpbWVyYTEiLCJleHBpcmVzIjozMTUzNjAwMH0.fPubN5HhuKhmg0o8gL5NA7TCNbtLdL6FxkG_B8A3U1s'
    }
};
var URL = 'http://localhost:4000';
var SLEEP_INTERVALL = 500;
var preparedString;
var activeJobID;

class ChimeraManager {


    constructor() {
        if (!!ChimeraManager.instance) {
            return ChimeraManager.instance;
        }

        ChimeraManager.instance = this;

        return this;
    }


    async play(playList) {

        for (let playJob of playList) {
            preparedString = this.prepareJob(playJob);
            //Send job to server
            activeJobID = await this.sendToServer(preparedString);
            //Waits until job is finished
            await this.checkJobState(activeJobID.job_id);
        }
    }

    async checkJobState(jobID) {

        var jsonDataObj = {
            'jsonrpc': '2.0',
            'id': '1',
            'method': 'get_workflow_progress',
            'params': [{'job_id': jobID}]
        };

        try {

            var response = await axios.post(URL, jsonDataObj, RPC_HEADER);

            while (response.data.result.job_state == 'active') {

                console.log('WAITING, ');
                console.log(response.data.result);

                await this.sleep(SLEEP_INTERVALL);
                response = await axios.post(URL, jsonDataObj, RPC_HEADER);
            }
            const data = response.data;
            console.log(data);
            return response.data.result;


        } catch (error) {
            console.log(error);
        }
    };

    async sendToServer(jsonData) {



        try {

            console.log('JSON DATA TO SEND');
            console.log(jsonData);

            const response = await axios.post(URL, jsonData, RPC_HEADER);
            return response.data.result;

        } catch (error) {
            console.log(error);
        }
    };

    async getAvailableJobs() {

        var preparedRequest = {
            'jsonrpc': '2.0',
            'id': '1',
            'method': 'get_available_workflows',
            'params': [{}]
        };


        return await this.sendToServer(preparedRequest);

    }

    async getArmPosition() {

        var armPosition = [this.num(), this.num(), this.num(), this.num(), this.num(), this.num(), this.num()];
        return armPosition;
    }

    async getBasePosition() {

        var basePosition = [this.num(), this.num(), this.num(), this.num(), this.num(), this.num(), this.num()];
        return basePosition;
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
