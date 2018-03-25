var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mongo');
var User = require('./models/users');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up port for server to listen on
const port = process.env.PORT || 3000;
const secret_key = process.env.SECRET || "pranjal123_sc";

// API Routes
var router = express.Router();
app.use('/', router);

router.use(function(req, res, next) {
  console.log('Processing...');
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
      expiresIn: 86400 // expires in 24 hours
    });
      res.status(200).send({ auth: true, token: token });
    });
  });



app.listen(port, () => {
  console.log("Server listening on port " + port);
});