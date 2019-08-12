var mongoose = require ('mongoose');

const { Model, Schema } = mongoose;
var request = require('request');

const JOBNAME = 'trigger_gripper_grip';

var GRIPPER_GRIP_SCHEMA = new Schema({
        _id: mongoose.Types.ObjectId,
        activationTimeout:Number
});


class Job_Gripper_Grip extends Model {


}




module.exports = mongoose.model(Job_Gripper_Grip, GRIPPER_GRIP_SCHEMA, 'job_gripper_grip');
