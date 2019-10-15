const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const JobSchema = require('./IJob');



// Extend JobSchema
/**
const GripperGripSchema = extendSchema(JobSchema, {
    job_type: String,
    rpc_name: { type: String, default: 'trigger_gripper_grip' }

});

**/
const Base = require('./IJob'); // we have to make sure our Book schema is aware of the Base schema

const Job_GripperGrip = Base.discriminator('Job_GripperGrip', new mongoose.Schema({
    job_type: String,
    rpc_name: { type: String, default: 'trigger_gripper_grip' }    }),
);

module.exports = mongoose.model('Job_GripperGrip');

 //module.exports = mongoose.model('Job_GripperGrip', GripperGripSchema,'GripperGripJobs');

//module.exports = mongoose.model('Job_GripperGrip', GripperGripSchema,'TEST');
