var mongoose = require ('mongoose');

var Schema = mongoose.Schema;

var methodSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: String
});

module.exports = mongoose.model('Method',methodSchema);
