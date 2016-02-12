var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var Project = require(libs + 'model/project');
var Counter = require(libs + 'model/counter');

router.post('/projectImplementation/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          implementation: req.body.content
        }
      },
      function(err, numAffected) {
        if (err) throw err;
        else {
          res.statusCode = 200;
          res.end();
        }
      });
  });

router.post('/projectImplementation/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          implementation: null
        }
      }, {
        upsert: true
      },
      function(err, numAffected) {
        if (err) throw err;
        else {
          res.statusCode = 200;
          res.end();
        }
      });
  });

router.get('/projectImplementation/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.implementation == null || result.implementation == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          content: result.implementation
        });
      }
    });
  }
);

router.post('/functionalRequirement/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'functionalid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      counter.next;

      var functionalRequirement = {
        id: counter.next,
        name: req.body.name,
        content: req.body.content
      };
      Project.findOneAndUpdate({
          id: req.params.id
        }, {
          $push: {
            functional: functionalRequirement
          }
        }, {
          upsert: true
        },
        function(err, result) {
          if (err) throw err;
          else {
            res.statusCode = 200;
            res.json(result.functional[result.functional.length - 1]);
          }
        });
    });
  });
router.post('/functionalRequirement/delete/:id(\\d+)/:functionalRequirementid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          functional: {
            id: req.params.functionalRequirementid
          }
        }
      }, {
        upsert: true
      },
      function(err, numAffected) {
        if (err) throw err;
        else {
          res.statusCode = 200;
          res.end();
        }
      });
  });
router.get('/functionalRequirement/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.functional.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.functional);
      }
    });
  }
);

module.exports = router;

function getNextSequence(name) {
  var ret = Counter.findAndModify({
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
