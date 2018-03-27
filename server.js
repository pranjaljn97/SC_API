var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var jsonpatch = require('jsonpatch');
var Jimp = require('jimp');
var bunyan = require('bunyan');

// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mongo');
var User = require('./models/users');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var log = bunyan.createLogger({name: "image-resize-api"});

// Set up port for server to listen on
const port = process.env.PORT || 3000;
const secret_key = process.env.SECRET || "pranjal123_sc";

// API Routes
var router = express.Router();
app.use('/', router);

router.use(function(req, res, next) {
  log.info('Processing...');
  next();
});

router.route('/login')
  .post(function(req, res) {
    var user = new User(); 
    user.userName = req.body.uname;
    user.password = req.body.pwd;

    user.save(function(err) {
      if (err) {
        res.send(err);
      }
       const token = jwt.sign({ userName: user._userName }, secret_key, {
      expiresIn: 86400 
    });
      res.status(200).send({ auth: true, token: token });
    });
  });

 router.route('/applypatch')
  .post(function(req, res) {
    
       mydoc1 = req.body.doc;
       thepatch = req.body.patch;
        
    var token = req.headers['x-access-token'];
    if(!token) 
    	return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secret_key, function(err, decoded) {
    if (err) 
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
   
patcheddoc = jsonpatch.apply_patch(mydoc1, thepatch);     
    res.status(200).send(patcheddoc);
  });
});

router.route('/getThumbnail')
  .post(function(req, res) {
    var url = req.body.url;
    var token = req.headers['x-access-token'];
    if(!token) 
    	return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secret_key, function(err, decoded) {
    if (err) 
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    
    Jimp.read(url).then(function (img) {
    img.resize(50,50)            
         .quality(40)                  
         .write("thumbnail.png", function(callback){
               res.status(200).sendFile( __dirname + "/thumbnail.png" );
         } );
}).catch(function (err) {
    res.status(401).send(err);
});
    
  });
});



app.listen(port, () => {
  log.info("Server listening on port " + port);
});