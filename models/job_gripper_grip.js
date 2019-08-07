var mongoose = require ('mongoose');

var Schema = mongoose.Schema;
const JOBNAME = 'trigger_gripper_grip';

var GRIPPER_GRIP_SCHEMA = new Schema({
        _id: mongoose.Types.ObjectId,
        activationTimeout:Number
});


function runOnMachine(){


}

//Zuerst Job Array, dannn Worfklow


module.exports = mongoose.model('GRIPPER_GRIP',GRIPPER_GRIP_SCHEMA);
