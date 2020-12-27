var express = require("express");
var bodyParser = require("body-parser");
var authRoute = require('./controllers/auth.route');
var questionRoute = require('./controllers/question.route');
var autheticate = require('./middlewares/authenticate')
var morgan = require('morgan');
var cors = require('cors')
var PORT = process.env.PORT || 3001;
require('./config/db');
var app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/auth',authRoute);
app.use('/question',autheticate,questionRoute);

app.use(function (err, req, res, next) {
    console.log('what comes in >>>', err);
    res.status(err.status || 400)
    res.json({
        message: err.msg || err
    })
});
app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT);
    });