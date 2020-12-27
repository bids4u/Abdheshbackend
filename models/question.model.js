var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 var questionSchema = new Schema({
     question:String,
     answer:[],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
 },{
     timestamps: true
 })
 var questionModel = mongoose.model('question', questionSchema)
module.exports = questionModel;