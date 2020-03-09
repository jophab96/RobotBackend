const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');

const JobSchema = new mongoose.Schema({
    _id:{type: mongoose.Types.ObjectId},
    activationTimeout:{type:Number}

});
/**
// Extend JobSchema
const GripperReleaseSchema = extendSchema(JobSchema, {
    job_type: String,
    rpc_name: { type: String, default: 'trigger_gripper_release' }

});

const GripperGripSchema = extendSchema(JobSchema, {
    job_type: String,
    rpc_name: { type: String, default: 'trigger_gripper_grip' }

});

const MoveBaseSchema = extendSchema(JobSchema, {
    job_type: String,
    rpc_name: { type: String, default: 'trigger_move_base' },
    goalPose: [Number]

});

const MoveArmSchema = extendSchema(JobSchema, {
    job_type: String,
    rpc_name: { type: String, default: 'trigger_move_arm_cartesian' },
    goalPose: [Number]

});



**/



module.exports = mongoose.model('IJob', JobSchema,'TEST');
/**
module.exports = mongoose.model('Job_MoveBase', MoveBaseSchema,);
module.exports = mongoose.model('Job_MoveArm', MoveArmSchema,);
module.exports = mongoose.model('Job_GripperGrip', GripperGripSchema,);
module.exports = mongoose.model('Job_GripperRelease', GripperReleaseSchema,);

**/