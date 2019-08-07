
var express = require('express');
var router = express.Router();
var mongoose = require ('mongoose');

const Method = require('../models/method');
const Workflow = require('../models/workflow');
const GRIPPER_GRIP = require('../models/job_gripper_grip');
var workflow ;


function saveWorkflow() {

  workflow.save().then(result =>{
    console.log(result);
    return result._id;
  });


}
function createWorkflow(created_at){

    workflow = new Workflow({
    _id : new mongoose.Types.ObjectId(),
    created_at: created_at ,
  });




}
function createGripperGripJob(activationTimeout){

  const gripper_grip = new GRIPPER_GRIP({
    _id: new mongoose.Types.ObjectId(),
    activationTimeout : activationTimeout
});

  workflow.jobs.push({_id_job_fk: gripper_grip._id,name: 'GRIPPER_GRIP'})

  gripper_grip.save().then(result =>{
    console.log('New GRIPPER JOB');
    console.log(result);
    return result._id;
  } );

}


/* POST methods listing. */
router.post('/', function(req, res, next) {


  let inputWorkflow = JSON.parse(req.body.jsondata); // string to generic object first

  createWorkflow(inputWorkflow.created_at);

  for (let job of inputWorkflow.job) {

    console.log('Working on: ' + job.name);

    switch(job.name) {
      case 'trigger_gripper_grip': {
        createGripperGripJob(5);
        break;
      }
      case 'trigger_move_base': {
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }

  }

  saveWorkflow();



  res.send('OK');


  });

/* GET workflow listing. */
router.get('/', function(req, res, next) {

  Workflow.find()
      .exec()
      .then(doc=>{console.log(doc);
          res.status(200).json(doc);
      })
      .catch();

});


module.exports = router;
