const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const JobSchema = require('./IJob');


/**
 * Mongoose Schema for all GripperRelease jobs.
 * @module GripperReleaseJob
 */



const Base = require('./IJob');

/**
 * @typedef Job_GripperRelease
 * @type {mongoose.Schema}
 * @property {String} job_type - job type of the job
 * @property {String} rpc_name - rpc name of the job
 */


const Job_GripperRelease = Base.discriminator('Job_GripperRelease', new mongoose.Schema({
    job_type: String,
    rpc_name: { type: String, default: 'trigger_gripper_release' }    }),
);

module.exports = mongoose.model('Job_GripperRelease');

// module.exports = mongoose.model('Job_GripperRelease', GripperReleaseSchema,'GripperReleaseJobs');
//module.exports = mongoose.model('Job_GripperRelease', GripperReleaseSchema,'TEST');

