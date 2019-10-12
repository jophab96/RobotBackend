
var Job = require('../models/Job').Job;

class GripperGripJob extends Job{




  doGripperGrip(){

      console.log("Gripping");

  }

    

}

exports.GripperGripJob = GripperGripJob;
