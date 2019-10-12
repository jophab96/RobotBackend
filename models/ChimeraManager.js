var mongoose = require('mongoose');
const axios = require('axios');

//const Definitions = require('../bin/definitions').Definitions;

const Workflow = require('../models/workflow');
const IJob = require('../models/IJob');
const Job_GripperGrip = require('../models/IJob');
const Job_GripperRelease = require('../models/IJob');
const Job_MoveBase = require('../models/IJob');
const Job_MoveArmCartesian = require('../models/IJob');

var GRIPPER_GRIP_NAME = 'GripperGrip';
var GRIPPER_RELEASE_NAME = 'GripperRelease';
var MOVE_BASE_NAME = 'MoveBase';
var MOVE_ARM_CARTESIAN_NAME = 'MoveArmCartesian';

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



class ChimeraManager {


    constructor() {
        if (!!ChimeraManager.instance) {
            return ChimeraManager.instance;
        }

        ChimeraManager.instance = this;

        return this;
    }


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

        var armPosition = [this.num(), this.num(), this.num(), this.num(), this.num(), this.num(),];
        return armPosition;
    }

    async getBasePosition() {

        var basePosition = [this.num(), this.num(), this.num(), this.num(), this.num(), this.num(),];
        return basePosition;
    }

    num() {

        return Math.floor(Math.random() * 100);

    }


}

exports.ChimeraManager = ChimeraManager;
