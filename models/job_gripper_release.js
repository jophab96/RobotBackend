var mongoose = require ('mongoose');

const { Model, Schema } = mongoose;
var request = require('request');


var GRIPPER_RELEASE_SCHEMA = new Schema({
        _id: mongoose.Types.ObjectId,
        activationTimeout:Number
});


class Job_Gripper_Release extends Model {


}




module.exports = mongoose.model(Job_Gripper_Release, GRIPPER_RELEASE_SCHEMA, 'job_gripper_release');
