var mongoose = require ('mongoose');

var Schema = mongoose.Schema;

var workflowSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    created_at: Date,
   //jobs : [String]

    jobs: [{
        _id_job_fk: mongoose.Types.ObjectId,
        name:String
    }],

});


//Zuerst Job Array, dannn Worfklow


module.exports = mongoose.model('Workflow',workflowSchema);
