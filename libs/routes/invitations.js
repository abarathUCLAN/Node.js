var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var Project = require(libs + 'model/project');

router.post('/createInvitation/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOneAndUpdate({
      id: req.params.id
    }, {
      $pushAll: {
        invitations: req.body
      }
    }, function(err, docs) {
      if (err) throw err;
      res.statusCode = 200;
      res.json();
    });
  }
);

router.post('/deleteInvitation/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
      id: req.params.id
    }, {
      $pull: {
        invitations: {
          email: req.body.email
        }
      }
    }, function(err, resu) {
      if (err) throw err;
      res.statusCode = 200;
      res.end();
    });
  }
);

router.get('/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, 'invitations', function(err, resu) {
      res.json(resu.invitations);
    });
  }
);

router.post('/addInvitationToProject/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    var invitation = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      type: req.body.type,
      email: req.body.email,
      id: 0
    }
    Project.update({
        id: req.params.id
      }, {
        $push: {
          invitations: invitation
        }
      },
      function(err, numAffected) {
        if (err) throw new err;
          res.statusCode = 200;
          res.json({id: 0});
      });
  });


router.get('/', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.find([{
      members: {
        userid: req.body.userId
      }
    }], function(err, docs) {
      if (err) throw err;
      res.statusCode = 200;
      res.json(docs);
    });
  });



module.exports = router;
