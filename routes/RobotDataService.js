var express = require('express');
var router = express.Router();

var ChimeraManager = require('../modules/ChimeraManager').ChimeraManager;

const chimeraMng = new ChimeraManager();



/** @module RobotDataService */

/** @function /getAvailableJobs (POST)
 * @description API Call to get a list of all available jobs
 * @param {Request} req - Input from Frontend
 * @return {Response<String[]>} res - list of all jobs
 */


router.post('/getAvailableJobs', async function (req, res) {


    res.send(await chimeraMng.getAvailableJobs());


});

/** @function /getArmPosition (POST)
 * @description API Call to get the actual arm position
 * @param {Request} req - Input from Client
 * @return {Response<Position>} res - Response to client which includes the actual arm position
 */

router.post('/getArmPosition', async function (req, res, next) {


    res.send(await chimeraMng.getArmPosition());


});

/** @function /getBasePosition (POST)
 * @description API Call to get the actual base position
 * @param {Request} req - Input from Client
 * @return {Response<Position>} res - Response to client which includes the actual base position
 */


router.post('/getBasePosition', async function (req, res, next) {


    res.send(await chimeraMng.getBasePosition());


});



module.exports = router;
