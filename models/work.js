const mongoose = require('mongoose')
const { Model, Schema } = mongoose

const workSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: String
})

class Work extends Model {


     helloWorld(){

        console.log("Hello myWork");

    }

    saySomething(text){

         console.log(text);
    }


}

module.exports = mongoose.model(Work, workSchema, 'work');
