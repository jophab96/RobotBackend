var mongoose = require ('mongoose');

var Schema = mongoose.Schema;
const JOBNAME = 'GRIPPER_GRIP';

var GRIPPER_GRIP_SCHEMA = new Schema({
        _id_job: mongoose.Types.ObjectId,
        activationTimeout:Number
});


//Zuerst Job Array, dannn Worfklow


module.exports = mongoose.model('GRIPPER_GRIP',GRIPPER_GRIP_SCHEMA);
