const axios = require('axios');
var CONFIG = require('../config/routingConfig');


var RPC_HEADER = {
    headers: {
        'user': CONFIG.user,
        'token': CONFIG.token
    }
};
var URL = CONFIG.chimeraURL;


var response;



class HTTPManager {

    /**
     * Constructor for the HTTP Manager.
     * @constructor
     * @return {HTTPManager} -  Instance of the HTTPManager - Singleton.
     */

    constructor() {
        if (!!HTTPManager.instance) {
            return HTTPManager.instance;
        }

        HTTPManager.instance = this;
        return this;
    }


    /**
     * Checks jobstate of the actual processed job.
     * @param {mongoose.Types.ObjectId} id ID of the processed Job
     * @return {String}  String of the actual job state.
     */

    //Request Job State from Chimera (active, done, canceled, etc..)
    async checkJobState(jobID) {

        var jsonDataObj = {
            'jsonrpc': '2.0',
            'id': '1',
            'method': 'get_workflow_progress',
            'params': [{'job_id': jobID}]
        };

        return new Promise((resolve, reject) => {

            axios.post(URL, jsonDataObj, RPC_HEADER).then(response => {

                resolve(response.data.result.job_state);

            })
                .catch(error => {
                    console.log(error)
                    reject(new Error("checkJobStateError"))

                })
        })
    }

    /**
     * Sends one Job to  Chimera.
     * @param {mongoose.Types.ObjectId} - ID of the processed Job
     * @return {String} - String of the actual Job State.
     */

    async sendJob(jsonData) {

        return new Promise((resolve, reject) => {

            axios.post(URL, jsonData, RPC_HEADER).then(response => {

                resolve(response.data.result.job_id);
            })
                .catch(error=>{
                    console.log(error)
                    reject(new Error("sendJobError"))
                })
        });
    };

    /**
     * Pulls all available jobs from Chimera
     * @return {String[]} - Array of the actual available jobs
     */


    async pullJobs() {

        var preparedRequest = {
            'jsonrpc': '2.0',
            'id': '1',
            'method': 'get_available_workflows',
            'params': [{}]
        };


        try {
            const response = await axios.post(URL, preparedRequest, RPC_HEADER);

            return response.data.result;


        } catch (error) {
            console.log(error);
        }
    }

}

exports.HTTPManager = HTTPManager;
