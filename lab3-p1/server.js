//server.js

//=======Base Setup==========

//call the oackages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/bears', {
    useMongoClient: true
});
var Bear = require('/home/ubuntu/workspace/SE3316_Lab3/lab3-p1/models/bear');

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
router.route('/bears')
    //create a BEAR (POST /api/bears)
    .post(function(req, res){
        var bear = new Bear();  //create new instance of bear model
        bear.name = req.body.name; //set the bear's name, coming from the request
        
        //save the bear and checkfor errors
        bear.save(function(err){
           if(err){
               res.send(err);
           } 
           else{
               res.json({message: 'Bear created'});
           }
        });
    })
    
    //get all the BEARS (GET /api/bears)
    .get(function(req, res){
        Bear.find(function(err, bears){
            if(err){
                res.send(err);
            }
            else{
                res.json(bears);
            }
        });
    });

router.route('/bears/:bear_id')
    //get the bear with the id (GET /api/bears/{{bear_id}})
    .get(function(req, res){
       Bear.findById(req.params.bear_id, function(err, bear){
          if(err){
              res.send(err);
          } 
          else{
              res.json(bear);
          }
       }); 
    })
    //update the bear with the id (PUT /api/bears/{{bear_id}})
    .put(function(req, res){
        //use the model to find the existing bear
        Bear.findById(req.params.bear_id, function(err, bear){
           if(err){
               res.send(err);
           } 
           else{
               bear.name = req.body.name;
               bear.save(function(err){
                  if(err){
                      res.send(err);
                  } 
                  else{
                      res.json({message: 'Bear updated'});
                  }
               });
           }
        });
    })
    //delete a bear with the id (DELETE /api/bears/{{bear_id}})
    .delete(function(req, res){
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear){
           if(err){
               res.send(err);
           } 
           else{
               res.json({message: 'Bear deleted'});
           }
        });
    });

//=======REGISTER ROUTES===========
//all routes prefixed with /api
app.use('/api', router);


//=======START THE SERVER==========
app.listen(port)
console.log('APP IS LISTENING ON PORT ' + port);