var router = require('express').Router();
var questionModel = require('./../models/question.model');
router.get('/user',(req,res,next)=>{
         var id = req.loggedInUser._id;
         console.log(req.loggedInUser)
         questionModel.find( { user:{_id:id} } )
                .sort({
                    _id: -1
                })
                .exec(function (err, products) {
                    if (err) {
                        return next(err);
                    }
                    res.json(products);
                    console.log(products)
                })
    })
router.route('/')
    .get((req,res,next)=>{
        questionModel.find({})
                .populate('user', {
                    username: 1
                })
                .sort({
                    _id: -1
                })
                .exec(function (err, products) {
                    if (err) {
                        return next(err);
                    }
                    res.json(products);
                })

    })
    .post( async (req , res , next)=> {
    console.log(req.body);
    newQuestion = new questionModel({});
    if(req.body.question){
        newQuestion.question = req.body.question;
    }
        newQuestion.user= req.loggedInUser._id;
        newQuestion.save()
        .then(function (data) {
            res.json(data);  
        })
        .catch(function (err) {
            next(err);
        })
})
router.route('/:id')
    .put( async (req , res , next)=> {
        console.log(req.body)
        var id = req.params.id;
            questionModel.findById(id)
                .exec(function (err, product) {
                    if (err) {
                        return next(err);
                    }
                    if (product) {
                        if(req.body.answer){
                            var data={ans:req.body.answer,auser:req.loggedInUser._id}
                            product.answer.push(data)
                        }
                        // console.log(req.body.answer)
                        // product.answer.push(req.body.answer)
                        product.save(function (err, updated) {
                            if (err) {
                                return next(err);
                            }
                            res.json(updated);
                        })
                    } else {
                        next({
                            msg: 'Product not found'
                        })
                    }
                })
    })
    .delete((req,res,next)=>{
        questionModel.findById(req.params.id)

                .then(function (product) {
                    if (product) {
                        product.remove(function (err, removed) {
                            if (err) {
                                return next(err);
                            }
                            res.json(removed);
                        });
                    } else {
                        next({
                            msg: 'Product not found'
                        });
                    }
                })
                .catch(function (err) {
                    next(err);
                });

    })
module.exports = router;