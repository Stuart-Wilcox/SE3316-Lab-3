//server.js

//=======Base Setup==========

//call the oackages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sanatize = require("sanitize-html");
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/bears', {
    useMongoClient: true
});
var Entry = require('/home/ubuntu/workspace/SE3316_Lab3/lab3-p2/models/entry');

//configure the app to use bodyParser
//this will allow reading of data from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;//set the port


//=======ROUTES FOR THE API=======
var router = express.Router();//get instance of express router

//middleware to use for all requests to /api
router.use(function(req, res, next){
    //do logging
    console.log('[' + req.method + '] ' + req.originalUrl);
    next();//go to next routes
});



//REAL ROUTES
router.route('/entries')
    //create a entry (POST /api/entry)
    .post(function(req, res){
        var entry = new Entry();  //create new instance of Entry model
        entry.text = req.body.text; //set the entry's text, coming from the request body
        entry.code = req.body.code;
        entry.date = Date();//set the entry's date
        
        //save the entry and check for errors
        entry.save(function(err){
           if(err){
               console.log(err);
               res.send(err);
           } 
           else{
               res.json({message: 'success'});
           }
        });
    })
    
    //get the last 20 entries in order (GET /api/entries)
    .get(function(req, res){
        //get the entries sorted by date from newest first to oldest last
        Entry.find({code: req.query.code}, function(err, entry){
            if(err){
                //err handling
                res.send(err);
            }
            else{
                //slice the array to the 20 newest messages then reverse it to go oldest to newest (this order is more convenient for DOM insertion)
                res.json(entry.slice(0, 19).reverse());
            }
        }).sort({'date':-1});
    })
    //delete the oldest message for a course (DELETE /api/entries?code={{course_code}})
    //this was only necessary to clean up after testing
    .delete(function(req, res){
        //get the entries sorted oldest to newest by course code supplied from query
        Entry.find({code: req.query.code}, function(err, entry){
            if(err){
                //err handling
                res.send(err);
            }
            //we can only remove a course if thereis at least 1
            else if(entry.length != 0){
                //get the oldest message (the first one after sorting oldest to newest)
                var id = entry[0]._id;
                //remove that message
                Entry.remove({_id: id}, function(err, doc){
                    if(err){
                        //err handling
                        res.send(err);
                    }
                    else{
                        //give feedback on remaining size
                        res.json({message:"Remaining size "+entry.length});
                    }
                });
            }
        })
        .sort({'date':'1'});
    });
    


//=======REGISTER ROUTES===========
//all routes prefixed with /api
app.use('/api', router);
//deliver static pages
app.use(express.static('static'));//used for getting html and js


//=======START THE SERVER==========
app.listen(port)
console.log('APP IS LISTENING ON PORT ' + port);