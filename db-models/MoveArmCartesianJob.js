const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const JobSchema = require('./IJob');


// Extend JobSchema
/**
 const MoveArmCartesianSchema = extendSchema(JobSchema, {
    job_type: String,
    rpc_name: { type: String, default: 'trigger_move_arm_cartesian' },
    goalPose: [Number]

});

 **/
const Base = require('./IJob'); // we have to make sure our Book schema is aware of the Base schema

const Job_MoveArmCartesian = Base.discriminator('Job_MoveArmCartesian', new mongoose.Schema({
        job_type: String,
        rpc_name: {type: String, default: 'trigger_move_arm_cartesian'},
        goalPose: [Number]
    }),
);

module.exports = mongoose.model('Job_MoveArmCartesian');
// module.exports = mongoose.model('Job_MoveArmCartesian', MoveArmCartesianSchema,'MoveArmCartesianJobs');

//module.exports = mongoose.model('Job_MoveArmCartesian', MoveArmCartesianSchema,'TEST');
