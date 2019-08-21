const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');

const JobSchema = new mongoose.Schema({
    _id:{type: mongoose.Types.ObjectId},
    activationTimeout:{type:Number},


});

// Extend JobSchema
const GripperReleaseSchema = extendSchema(JobSchema, {
    job_type: String,
    rpc_name: { type: String, default: 'trigger_gripper_release' }

});

const GripperGripSchema = extendSchema(JobSchema, {
    job_type: String,
    rpc_name: { type: String, default: 'trigger_gripper_grip' }

});



module.exports = mongoose.model('IJob', JobSchema);
module.exports = mongoose.model('Job_GripperGrip', GripperGripSchema);
module.exports = mongoose.model('Job_GripperRelease', GripperReleaseSchema);

