//server.js

//=======Base Setup==========

//call the oackages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sanatize = require("sanitize-html");
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

//middleware to use for all requests
router.use(function(req, res, next){
    //do logging
    console.log('Something happened');
    next();//go to next routes
});



//REAL ROUTES
router.route('/entries')
    //create a entry (POST /api/entry)
    .post(function(req, res){
        var entry = new Entry();  //create new instance of Entry model
        console.log(req.body.text);
        entry.text = req.body.text; //set the entry's text, coming from the request body
        entry.date = Date();//set the entry's date
        
        //save the entry and check for errors
        entry.save(function(err){
           if(err){
               res.send(err);
           } 
           else{
               res.json({message: 'success'});
           }
        });
    })
    
    //get the last 20 entries in order (GET /api/entries)
    .get(function(req, res){
        Entry.find({}, {"sort": [["date","asc"]]}, function(err, entry){
            if(err){
                res.send(err);
            }
            else{
                res.json(entry);
            }
        });
    });


//=======REGISTER ROUTES===========
//all routes prefixed with /api
app.use('/api', router);


//=======START THE SERVER==========
app.listen(port)
console.log('APP IS LISTENING ON PORT ' + port);