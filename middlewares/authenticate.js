var jwt = require('jsonwebtoken');
var config = require('./../config/config');
var UserModel = require("./../models/user.model");
module.exports = function (req, res, next) {
    // console.log('req.headers >>', req.headers);
    var token;
    if (req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
    }
    if (req.headers['authorization']) {
        token = req.headers['authorization'];
    }
    if (req.headers['token']) {
        token = req.headers['token'];
    }
    if (req.query.token) {
        token = req.query.token;
    }
    if (token) {
        // jwt.verify(token, config.jwts, function (err, decoded) {
        //     if (err) {
        //         return next(err);
        //     }
        //     console.log('decoded >>>', decoded);
        //     UserModel.findById(decoded.id, function (err, user) {
        //         if (err) {
        //             return next(err);
        //         }
        //         if (user) {   console.log(String(token));
                    req.loggedInUser = { _id:token } ;
                    return next();
        //         } else {
        //             next({
        //                 msg: 'Token User is removed form system'
        //             })
        //         }
        //     })

        // })
    } else {
        next({
            msg: 'token not provided '
        })
    }
}
