const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');

const JobSchema = new mongoose.Schema({
    _id:{type: mongoose.Types.ObjectId},
    activationTimeout:{type:Number}

});

module.exports = mongoose.model('IJob', JobSchema,'TEST');
