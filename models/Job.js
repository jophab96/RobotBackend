class Job {


    constructor(job_id) {

        this.job_id = job_id;

    }

    get getJobName() {

        console.log(this.job_id);
        return this.job_id;

    }



}

exports.Job = Job;
