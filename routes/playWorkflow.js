var express = require('express');
var router = express.Router();

var DBManager = require('../modules/DBManager').DBManager;
var ChimeraManager = require('../modules/ChimeraManager').ChimeraManager;

const dataBaseManager = new DBManager();
const chimeraMng = new ChimeraManager();

let workflowID;
let playList;
let result = new Object();

/** @module routes/playWorkflow */

/* POST methods listing. */
router.post('/', async function (req, res, next) {


    workflowID = req.body.wf_id;
    workflow = await dataBaseManager.createPlayList(workflowID);

    chimeraMng.setWorkflow(workflow);
    chimeraMng.executeWorkflow();

    result.wf_id = workflowID;
    res.send(result);
});

/* POST methods listing. */
router.post('/workflowProgress', async function (req, res, next) {

    result.workflowProgress = chimeraMng.getWorkflowProgress();
    res.send(result);
});


/* GET workflow listing. */
router.get('/', function (req, res, next) {


});


module.exports = router;
