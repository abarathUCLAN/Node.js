var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var Project = require(libs + 'model/project');
var Counter = require(libs + 'model/counter');

router.post('/projectManual/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          manual: req.body.content
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

router.post('/projectManual/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          manual: null
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

router.get('/projectManual/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.manual == null || result.manual == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          content: result.manual
        });
      }
    });
  }
);

router.post('/protocol/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'protocolid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      counter.next;

      var protocol = {
        id: counter.next,
        criteria: req.body.criteria,
        criteriaName: req.body.criteriaName,
        note: req.body.note,
        requirement: req.body.requirement,
        fulfilled: req.body.fulfilled
      };
      Project.findOneAndUpdate({
          id: req.params.id
        }, {
          $push: {
            protocol: protocol
          }
        }, {
          upsert: true
        },
        function(err, result) {
          if (err) throw err;
          else {
            res.statusCode = 200;
            res.json(result.protocol[result.protocol.length - 1]);
          }
        });
    });
  });
router.post('/protocol/delete/:id(\\d+)/:protocolid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          protocol: {
            id: req.params.protocolid
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
router.get('/protocol/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.protocol.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.protocol);
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
