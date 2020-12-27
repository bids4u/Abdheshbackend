var router = require('express').Router();
var passwordHash = require('password-hash');
var userModel = require('./../models/user.model')
var jwt = require('jsonwebtoken');
var config = require('./../config/config');
var sender = require('./../config/nodemailer.config.js');
function prepareMail(details) {
    var msgBody = {
        from: 'Login Project Mgmt<noreply@abcd.com>',
        to: details.email,
        replyTo: 'bidhanbabugupta@gmail.com',
        subject: 'Activate Account',
        text: 'Activate Account',
        html: `<p>Hi <strong>${details.name}</strong></p>
        <p>Please click the link below to reset your account</p>
        <p><a href="${details.link}" target="_blank">Activate</a></p>
        <p>If you have not requested to activate your account,kindly ignore this email.</p>
        <p>Regards,</p>
        <p>Login Project Mgmt</p>`
    }
    return msgBody;
}

var PORT = process.env.PORT || 3001;
router.post('/register', async (req , res , next)=> {
    console.log('body is:',req.body)
    var newUser = new userModel({});

    newUser.name = req.body.name;
    if (req.body.email){
        userModel.findOne({
            email: req.body.email
        }).exec((err,user)=>{
            if(user){
                next({msg:"Email is already registered"});
            }
                newUser.email = req.body.email;
            
        })
    }
    if(req.body.userName){
        userModel.findOne({
            userName: req.body.userName
        }).exec((err,user)=>{
            if(user){
                next({msg:"userName is already registered"});
            }
                newUser.userName = req.body.userName;
            
        })
    }
    newUser.email = req.body.email;
    newUser.userName = req.body.userName;
    if(req.body.password)
    {newUser.password = passwordHash.generate(req.body.password)}
    
    if(req.body.role)
    {newUser.role = req.body.role;}
    
    if(req.body.status)
    {newUser.status = req.body.status;}

    if(req.file)
    {newUser.image = req.file.filename;}
    // var token = jwt.sign({ userName: req.body.userName, email: req.body.email }, config.jwts);
    // var resetLink = req.headers.origin + '/auth/activate/' + token;
    // var mailBody = prepareMail({
    //     name: req.body.userName,
    //     email: req.body.email,
    //     link: resetLink
    // });
    newUser.save()
        .then(function (data) {
            // if(!req.body.status){
            // sender.sendMail(mailBody, function(err, done) {
            //     if (err) {
            //         return next(err)
            //     } else { res.json(data);}})
            // }
            // else{
                    res.json(data);
                // }
            
        })
        .catch(function (err) {
            next(err);
        })
   

})

router.post('/login', async (req , res , next)=> {
    if(req.body.method=="google"){
         if(req.body.email){
        userModel.findOne({
            email: req.body.email
        }).exec((err,user)=>{
            if(user){
                if (user.status == 'active') {
                    var token = jwt.sign({ name: user.email, id: user._id }, config.jwts);
                            res.json({
                                token: token,
                                user: user
                            });
                }
                else{
                        next({msg:"User not active"});
                    }
            }else{
                next({msg:"Register your email"})
            }
            
        })}
    else{
        next({msg:"Register your email"})
    }
}else{
     console.log('body is:',req.body)
    if(req.body.userName){
        userModel.findOne({
            userName: req.body.userName
        }).exec((err,user)=>{
            if(user){
                if (user.status == 'active') {
                    var isMatched = passwordHash.verify(req.body.password, user.password);
                    if (isMatched) {
                        var token = jwt.sign({ name: user.email, id: user._id }, config.jwts);
                        res.json({
                            token: token,
                            user: user
                        });
                    }else{
                        next({msg:"Password did not match"});
                    }
                }else{
                    next({msg:"User not active"});
                }
            }else{
                next({msg:"Username not matched"});
            }
           
        })
    }else{
        next({msg:"username did not match"})
    }
}
   
    
})

router.post('/google',(req,res,next)=>{
    if(req.body.email){
        userModel.findOne({
            email: req.body.email
        }).exec((err,user)=>{
            if(user){
                if (user.status == 'active') {
                    var token = jwt.sign({ name: user.email, id: user._id }, config.jwts);
                            res.json({
                                token: token,
                                user: user
                            });
                }
                else{
                        next({msg:"User not active"});
                    }
            }else{
                next({msg:"Register your email"})
            }
            
        })}
    else{
        next({msg:"Register your email"})
    }
})

router.post('/forget',(req,res,next)=>{
    console.log(req.body)
    userModel.findOne({
        email: req.body.email
    })
    .exec(function(err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            if(user.userName){
                var resetLink =req.headers.origin+'/auth/reset-password/' + user._id;
                var mailBody = {
                    from: 'Login Project Mgmt<noreply@abcd.com>',
                    to: req.body.email,
                    replyTo: 'bidhanbabugupta@gmail.com',
                    subject: 'Reset Account',
                    text: 'Reset Account',
                    html: `<p>Hi <strong>${user.userName}</strong></p>
                    <p>Please click the link below to reset your account</p>
                    <p><a href="${resetLink}" target="_blank">Reset</a></p>
                    <p>If you have not requested to reset your account,kindly ignore this email.</p>
                    <p>Regards,</p>
                    <p>Login Project Mgmt</p>`
                };
                user.save(function(err, saved) {
                    if (err) {
                        return next(err);
                    }
                    sender.sendMail(mailBody, function(err, done) {
                        if (err) {
                            return next(err);
                        } else {
                            res.json(done);
                        }
                    })
                })
            }else{
                next({msg:"You are registered with google"})
            }

        } else {
            next({
                msg: 'User not registered with provided email'
            })
        }
    })


})

router.post('/reset-password/:id', function(req, res, next) {
    var id = req.params.id;
    userModel.findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
                user.password = passwordHash.generate(req.body.password);
                user.save(function(err, done) {
                    if (err) {
                        return next(err);
                    }
                    res.json(done);
                })
            } else {
                next({
                    msg: 'User not found'
                })
            }
        })
    })

router.get('/activate/:token',(req,res,next)=>{
    var token = req.params.token;
    if (token) {
        jwt.verify(token, config.jwts, function (err, decoded) {
            if (err) {
                return next(err);
            }
            // console.log('decoded >>>', decoded);
            userModel.findOne({email:decoded.email}, function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    user.status = 'active';
                    user.save()
                        .then(function (data) {
                            res.json({msg:"User is Activated"});
                        })
                        .catch(function (err) {
                            next(err);
                        })
                    
                } else {
                    next({
                        msg: 'Token User is removed form system'
                    })
                }
            })

        })
    } else {
        next({
            msg: 'token not provided '
        })
    }
})
router.get('/user/:id',(req,res,next)=>{
    var id = req.params.id;
    userModel.findOne({_id:id})
    .exec((err,done)=>{
        if(err){return next(err);}
        else{res.json(done.name);}
    })
})
module.exports = router;