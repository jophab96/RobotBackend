const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const JobSchema = require('./IJob');

/**
 * Mongoose Schema for all MoveArmCartesian jobs.
 * @module MoveArmCartesianJob
 */


const Base = require('./IJob');


/**
 * @typedef Job_MoveArmCartesian
 * @type {mongoose.Schema}
 * @property {String} job_type - job type of the job
 * @property {String} rpc_name - rpc name of the job
 * @property {Number[]} goalPose - goal position of the job
 */


const Job_MoveArmCartesian = Base.discriminator('Job_MoveArmCartesian', new mongoose.Schema({
        job_type: String,
        rpc_name: {type: String, default: 'trigger_move_arm_cartesian'},
        goalPose: [Number]
    }),
);

module.exports = mongoose.model('Job_MoveArmCartesian');
