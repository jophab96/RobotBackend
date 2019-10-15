const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const JobSchema = require('./IJob');



// Extend JobSchema


/**
const GripperReleaseSchema = extendSchema(JobSchema, {
    job_type: String,
    rpc_name: { type: String, default: 'trigger_gripper_release' }

});


**/
const Base = require('./IJob'); // we have to make sure our Book schema is aware of the Base schema

const Job_GripperRelease = Base.discriminator('Job_GripperRelease', new mongoose.Schema({
    job_type: String,
    rpc_name: { type: String, default: 'trigger_gripper_release' }    }),
);

module.exports = mongoose.model('Job_GripperRelease');

// module.exports = mongoose.model('Job_GripperRelease', GripperReleaseSchema,'GripperReleaseJobs');
//module.exports = mongoose.model('Job_GripperRelease', GripperReleaseSchema,'TEST');

