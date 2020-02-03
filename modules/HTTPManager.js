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


var response;


class HTTPManager {


    constructor() {
        if (!!HTTPManager.instance) {
            return HTTPManager.instance;
        }

        HTTPManager.instance = this;
        return this;
    }

    //Request Job State from Chimera (active, done, canceled, etc..)
    async checkJobState(jobID) {

        var jsonDataObj = {
            'jsonrpc': '2.0',
            'id': '1',
            'method': 'get_workflow_progress',
            'params': [{'job_id': jobID}]
        };

        try {

            response = await axios.post(URL, jsonDataObj, RPC_HEADER);
            console.log('From Check Job State');
            console.log(response.data);

            return response.data.result.job_state;

        } catch (error) {
            console.log(error);
        }



    };

//Maybe UNUSED
    async getJobState(jobID) {

        var jsonDataObj = {
            'jsonrpc': '2.0',
            'id': '1',
            'method': 'get_workflow_progress',
            'params': [{'job_id': jobID}]
        };

        try {

            var response = await axios.post(URL, jsonDataObj, RPC_HEADER);

            return response.data.result;


        } catch (error) {
            console.log(error);
        }

    }


    async sendJob(jsonData) {

        try {
            const response = await axios.post(URL, jsonData, RPC_HEADER);
            console.log("Result from SendJob");
            console.log(response.data.result);
            return response.data.result.job_id;
        } catch (error) {
            console.log(error);
        }
    };

    async pullJobs() {

        var preparedRequest = {
            'jsonrpc': '2.0',
            'id': '1',
            'method': 'get_available_workflows',
            'params': [{}]
        };


        try {
            const response = await axios.post(URL, preparedRequest, RPC_HEADER);
            console.log("Result from pullJobs");
            console.log(response.data.result);
            return response.data.result;
        } catch (error) {
            console.log(error);
        }
    }

}

exports.HTTPManager = HTTPManager;
