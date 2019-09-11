var mongoose = require('mongoose');
const { Model, Schema } = mongoose;
var request = require('request');




var workflowSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, default: 'MyCustomName' },
    created_at: { type: Date, default: Date.now },
    //jobs : [String]

    jobs: [{
        _id_job_fk: mongoose.Types.ObjectId,
        job_type: String
    }],

});

class WorkFlow extends Model {







}


module.exports = mongoose.model(WorkFlow, workflowSchema, 'workflow');
