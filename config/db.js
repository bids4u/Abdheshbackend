var dbUrl = require("./config")
var mongoose = require('mongoose')
mongoose.connect(dbUrl.db,{ useUnifiedTopology: true } ,function (err, done) {
    if (err) {
        console.log('database connection failed')
    }
    else {
        console.log('Database connection success')
    }
})