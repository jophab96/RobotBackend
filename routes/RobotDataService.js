var express = require('express');
var router = express.Router();

var ChimeraManager = require('../modules/ChimeraManager').ChimeraManager;

const chimeraMng = new ChimeraManager();


/* POST methods listing. */
router.post('/getAvailableJobs', async function (req, res, next) {


    res.send(await chimeraMng.getAvailableJobs());


});

router.post('/getArmPosition', async function (req, res, next) {


    res.send(await chimeraMng.getArmPosition());


});

router.post('/getBasePosition', async function (req, res, next) {


    res.send(await chimeraMng.getBasePosition());


});


router.post('/test', async function (req, res, next) {


    res.send('ok');


});


/* GET workflow listing. */
router.get('/', function (req, res, next) {


});


module.exports = router;
