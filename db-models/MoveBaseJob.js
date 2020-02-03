const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const JobSchema = require('./IJob');


const Base = require('./IJob'); // we have to make sure our Book schema is aware of the Base schema

const Job_MoveBase = Base.discriminator('Job_MoveBase', new mongoose.Schema({
        job_type: String,
        rpc_name: {type: String, default: 'trigger_move_base'},
        goalPose: [Number]
    }),
);

module.exports = mongoose.model('Job_MoveBase');
