var mongoose = require('mongoose');
const { Model, Schema } = mongoose;
var request = require('request');




var workflowSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    created_at: Date,
    //jobs : [String]

    jobs: [{
        _id_job_fk: mongoose.Types.ObjectId,
        name: String
    }],

});

class WorkFlow extends Model {





    saySomething(text) {

        console.log(text);
    }


}


module.exports = mongoose.model(WorkFlow, workflowSchema, 'workflow');
