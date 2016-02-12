var express = require('express');
var passport = require('passport');
var router = express.Router();
var crypto = require('crypto');

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var User = require(libs + 'model/user');
var Token = require(libs + 'model/accessToken');
var RefreshToken = require(libs + 'model/refreshToken');
var iz = require('node_modules/iz/amd/iz'),
  are = require('node_modules/iz/amd/are'),
  validators = require('node_modules/iz/amd/validators');

router.get('/changeData', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    User.findOne({
      _id: req.user.userId
    }, function(error, result) {
      if (error) throw err;
      res.json({
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.username
      });
    });
  }
);

router.post('/logout', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Token.find({
      userId: req.user.userId
    }).remove(function(error, result) {
      if (error) throw error;
      RefreshToken.find({
        userId: req.user.userId
      }).remove(function(err, resu) {
        if (err) throw err;
        res.statusCode = 200;
        res.end();
      });
    });
  });


router.post('/changeData', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    User.findById(req.user.userId,
      function(err, doc) {
        if (err) throw err;
        doc.firstname = req.body.firstname;
        doc.lastname = req.body.lastname;
        doc.password = req.body.password;
        doc.save(function(error, result) {
          if (error) throw error;
          else {
            res.statusCode = 200;
            res.end();
          }
        });
      });
  });


router.post('/register', function(req, res) {

  var user = new User({
    username: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  });

  user.save(function(err, user) {
    if (!err) {
      res.statusCode = 200;
      res.json(user);
    } else {
      res.statusCode = 400;
      res.json(err);
    }
  });

});

router.post('/getUserByEmail', function(req, res) {
  User.findOne({
    username: req.body.email
  }, 'firstname lastname username', function(error, result) {
    if (error) throw new err;
    if (result === null) {
      res.statusCode = 400;
      res.end();
    } else {
      res.statusCode = 200;
      res.json(new Array({
        email: result.username,
        firstname: result.firstname,
        lastname: result.lastname
      }));
    }
  });
});

router.get('/rights/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    User.findOne({
      username: req.body.email
    }, 'firstname lastname username', function(error, result) {
      if (error) throw new err;
      console.log(result);
      if (result === undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(new Array({
          email: result.username,
          firstname: result.firstname,
          lastname: result.lastname
        }));
      }
    });
  });

module.exports = router;

function encryptPassword(password, salt) {
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
};
