const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const JobSchema = require('./IJob');

/**
 * Mongoose Schema for all NewMethod jobs.
 * @module NewMethodJob
 */

const Base = require('./IJob'); //

/**
 * @typedef Job_NewMethod
 * @type {mongoose.Schema}
 * @property {String} job_type - job type of the job
 * @property {String} rpc_name - rpc name of the job
 */

const Job_NewMethod = Base.discriminator('Job_NewMethod', new mongoose.Schema({
    job_type: String,
    rpc_name: { type: String, default: 'trigger_new_method' }    }),
);

module.exports = mongoose.model('Job_NewMethod');


