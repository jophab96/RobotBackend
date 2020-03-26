const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const JobSchema = require('./IJob');

/**
 * Mongoose Schema for all MoveBase jobs.
 * @module MoveBaseJob
 */

const Base = require('./IJob'); // we have to make sure our Book schema is aware of the Base schema

/**
 * @typedef Job_MoveBase
 * @type {mongoose.Schema}
 * @property {String} job_type - job type of the job
 * @property {String} rpc_name - rpc name of the job
 * @property {Number[]} goalPose - goal position of the job
 */


const Job_MoveBase = Base.discriminator('Job_MoveBase', new mongoose.Schema({
        job_type: String,
        rpc_name: {type: String, default: 'trigger_move_base'},
        goalPose: [Number]
    }),
);

module.exports = mongoose.model('Job_MoveBase');
