var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    userName: {
        type: String,
    },
    password: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    role: {
        type: Number,
        enum: [1, 2, 3],
        default: 2
    },
    name: {
        type: String,
        required: true
    },
    createdTime: Date,
    updatedTime: Date,
    image: String
});
var userModel = mongoose.model('users', userSchema)
module.exports = userModel;
