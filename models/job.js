var mongoose = require ('mongoose');

class Job extends mongoose.Schema {
    constructor() {
        const job = super({
            _id: mongoose.Types.ObjectId,
            name: String
        });

       // Work.helloWorld = this.helloWorld();
        job.methods.getCustomerTypes = this.getCustomerTypes;


        return job;
    }

    helloWorld() {
        console.log("Hello World");
    }

    byeWorld() {
        console.log("Bye World");
    }


}

module.exports = mongoose.model('JOB',new Job);
