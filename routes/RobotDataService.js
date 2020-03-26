var express = require('express');
var router = express.Router();

var ChimeraManager = require('../modules/ChimeraManager').ChimeraManager;

const chimeraMng = new ChimeraManager();



/** @module RobotDataService */

/** @function /getAvailableJobs (POST)
 * API Call to get a list of all available jobs
 * @param {List} req - Input from Frontend
 * @return {List<jobs>} res - list of all jobs
 */


router.post('/getAvailableJobs', async function (req, res) {


    res.send(await chimeraMng.getAvailableJobs());


});

/** @function /getArmPosition (POST)
 * API Call to get the actual arm position
 * @param {Request} req - Input from Client
 * @return {Response<ArmPosition>} res - Response to client which includes the actual arm position
 */

router.post('/getArmPosition', async function (req, res, next) {


    res.send(await chimeraMng.getArmPosition());


});

/** @function /getBasePosition (POST)
 * API Call to get the actual base position
 * @param {Request} req - Input from Client
 * @return {Response<BasePosition>} res - Response to client which includes the actual base position
 */


router.post('/getBasePosition', async function (req, res, next) {


    res.send(await chimeraMng.getBasePosition());


});



module.exports = router;
