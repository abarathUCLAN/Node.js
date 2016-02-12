var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var Project = require(libs + 'model/project');
var Counter = require(libs + 'model/counter');

router.post('/projectDescription/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          projectDescription: req.body.description
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

router.post('/effortEstimation/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          effortEstimation: JSON.stringify(req.body.content)
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

router.post('/risk/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'riskid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      counter.next;

      var risk = {
        id: counter.next,
        name: req.body.name,
        content: req.body.content
      };
      Project.findOneAndUpdate({
          id: req.params.id
        }, {
          $push: {
            risks: risk
          }
        }, {
          upsert: true
        },
        function(err, result) {
          if (err) throw err;
          else {
            res.statusCode = 200;
            res.json(result.risks[result.risks.length - 1]);
          }
        });
    });
  });

router.post('/projectDescription/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          projectDescription: null
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

router.post('/effortEstimation/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          effortEstimation: null
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

router.post('/risk/delete/:id(\\d+)/:riskid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          risks: {
            id: req.params.riskid
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

router.get('/projectDescription/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.projectDescription == null || result.projectDescription == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          description: result.projectDescription
        });
      }
    });
  }
);

router.get('/effortEstimation/:id(\\d+)', passport.authenticate('bearer', {
  session: false
}),
function(req, res) {
  Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.effortEstimation == null || result.effortEstimation == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.effortEstimation);
      };
  });
});

router.get('/risk/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.risks.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.risks);
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
