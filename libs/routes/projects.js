var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var Project = require(libs + 'model/project');
var User = require(libs + 'model/user');
var Counter = require(libs + 'model/counter');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

router.post('/', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'projectid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      if (err) throw err;
      var project = new Project({
        id: counter.next,
        name: req.body.name,
        acronym: req.body.acronym,
        description: req.body.description,
        user_id: req.user.userId,
        members: [{
          rights: 2,
          member: req.user.userId
        }]
      });
      project.save(function(err, project) {
        if (!err) {
          res.statusCode = 200;
          res.json(project.id);
        } else {
          res.statusCode = 400;
          res.json(err);
        }
      });
    });
  }
);

router.post('/addMemberToProject/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    User.find({
      username: req.body.email
    }, '_id', function(error, result) {
      if (error) throw new error;
      var newMember = {
        rights: req.body.type,
        member: result[0]._id
      };
      Project.update({
          id: req.params.id
        }, {
          $push: {
            members: newMember
          }
        },
        function(err, numAffected) {
          if (err) throw new err;
          else {
            res.statusCode = 200;
            res.json(new Array({
              id: result[0]._id
            }));
          }
        });
    });
  });

router.post('/removeProjectMember/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    User.findOne({
      username: req.body.email
    }, function(error, result) {
      var id = result._id;
      Project.update({
        id: req.params.id
      }, {
        $pull: {
          members: {
            member: id
          }
        }
      }, function(err, resu) {
        if (err) throw err;
        res.statusCode = 200;
        res.json(new Array({
          id: result._id
        }));
      });
    });
  });



router.get('/', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.find({
      "members.member": req.user.userId
    }, function(err, docs) {
      if (err) throw err;
      if (docs.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.json(docs);
      }
    });
  });

router.get('/dashboard/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
        id: req.params.id
      },
      function(err, docs) {
        if (err) throw err;
        var preliminaryCounter = 0;
        if (docs.projectDescription != null)
          preliminaryCounter++;
        if (docs.risks.length != 0)
          preliminaryCounter++;
        if (docs.effortEstimation != null)
          preliminaryCounter++;

        var requirementCounter = 0;
        if (docs.introduction != null)
          requirementCounter++;
        if (docs.result != null)
          requirementCounter++;
        if (docs.use != null)
          requirementCounter++;
        if (docs.actualState != null)
          requirementCounter++;
        if (docs.targetState != null)
          requirementCounter++;
        if (docs.productData != null)
          requirementCounter++;
        if (docs.quality != null)
          requirementCounter++;
        if (docs.needs.length != 0)
          requirementCounter++;
        if (docs.nices.length != 0)
          requirementCounter++;
        if (docs.nonfunctional.length != 0)
          requirementCounter++;

        var functionalCounter = 0;
        if (docs.projectImplementation != null)
          functionalCounter++;
        if (docs.functional.length != 0)
          functionalCounter++;

        var finalizationCounter = 0;
        if (docs.manual != null)
          finalizationCounter++;
        if (docs.protocol.length != 0)
          finalizationCounter++;

        res.json({
          preliminaryStudy: calculatePercent(preliminaryCounter, 3),
          functionalSpecification: calculatePercent(functionalCounter, 2),
          finalization: calculatePercent(finalizationCounter, 2),
          requirementSpecification: calculatePercent(requirementCounter, 10)
        });
      });
  });

  function calculatePercent(counter, number) {
    if(counter == 0)
      return 0;
    return Math.round(((100/number) * counter) * 10) /10;
  }


router.get('/rights/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {

    Project.findOne({
        id: req.params.id
      }, {
        members: {
          $elemMatch: {
            member: req.user.userId
          }
        }
      },
      function(err, docs) {
        if (err) throw err;
        res.json(docs.members[0].rights);
      });
  });

router.get('/getProjectName/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, docs) {
      if (err) throw err;
      res.statusCode = 200;
      res.json({
        name: docs.name
      });
    });
  });

router.get('/getProjectMembers/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }).populate("members.member").select('_id members').exec(function(error, result) {
      var members = new Array();
      for (var i = 0, len = result.members.length; i < len; i++) {
        members.push({
          firstname: result.members[i].member.firstname,
          lastname: result.members[i].member.lastname,
          email: result.members[i].member.username,
          type: result.members[i].rights,
          id: result.members[i]._id
        });
        if (i == len - 1) {
          res.statusCode = 200;
          res.json(members);
        }
      }
    });
  });



module.exports = router;


function getNextSequence(name) {
  var ret = counter.findAndModify({
    query: {
      _id: name
    },
    update: {
      $inc: {
        seq: 1
      }
    },
    new: true
  });

  return ret.seq;
}
