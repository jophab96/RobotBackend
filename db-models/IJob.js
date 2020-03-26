const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');


/**
 * Mongoose Base Schema for all Jobs.
 * @module IJob
 */


/**
 * @typedef JobSchema
 * @type {mongoose.Schema}
 * @property {mongoose.Types.ObjectId} _id - ID of the job
 * @property {Number} activationTimeout - activationTimeout Paramater
 */
const JobSchema = new mongoose.Schema({
    _id:{type: mongoose.Types.ObjectId},
    activationTimeout:{type:Number}

});

module.exports = mongoose.model('IJob', JobSchema,'TEST');
