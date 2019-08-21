
var Job = require('../models/job');


class SubJob extends Job{

    constructor(a) {


        super(null);
        this.a = a;
    }

helloWorld() {
    super.helloWorld();
}

helloExtend(){
    console.log("Bye Extend");

}

}

module.exports = SubJob;


