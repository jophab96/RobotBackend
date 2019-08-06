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
    _id_job: new mongoose.Types.ObjectId(),
    activationTimeout : activationTimeout
});

  workflow.jobs.push({id_job_fk: gripper_grip._id_job,name: 'GRIPPER_GRIP'})

  gripper_grip.save().then(result =>{
    console.log(result);
    return result._id_job;
  } );

}


/* POST methods listing. */
router.post('/', function(req, res, next) {



  //JSON Input des Workflow Objects
  //Iteriere über Jobs und zerlege diese

  //JSON.getDate
  createWorkflow(Date.now());

  createGripperGripJob(5);
  createGripperGripJob(5);

  saveWorkflow();

  res.send('Saved to the BD');


  /**
  worfklow.save().then(result =>{
    console.log(result);
    res.send('Saved to the BD'+ result);

  }).catch(err=>console.log(err));
**/

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
