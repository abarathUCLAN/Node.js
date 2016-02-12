var express = require('express');
var passport = require('passport');
var router = express.Router();
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var Project = require(libs + 'model/project');
var Counter = require(libs + 'model/counter');
var fs = require('fs');

router.get('/presentation/download/:id', function(req, res) {
  Project.findOne({
    "presentation.id": req.params.id
  }, 'presentation', function(err, result) {

    for (var i = 0; i < result.presentation.length; i++) {
      if (result.presentation[i].id == req.params.id) {
        res.download(process.cwd() + "/uploads/" + result.presentation[i].file);
      }
    }
  });
});

router.post('/presentation/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }), multipartyMiddleware,
  function(req, res) {
    var file = req.files.file;
    fs.readFile(file.path, function(err, data) {
      var newPath = process.cwd() + "/uploads/" + file.originalFilename;
      fs.writeFile(newPath, data, function(err) {
        if (err) throw err;
        Counter.findAndModify({
          _id: 'presentationid'
        }, [], {
          $inc: {
            next: 1
          }
        }, {}, function(err, counter) {
          counter.next;

          var presentation = {
            id: counter.next,
            name: req.body.name,
            content: req.body.content,
            file: file.originalFilename
          };
          Project.findOneAndUpdate({
              id: req.params.id
            }, {
              $push: {
                presentation: presentation
              }
            }, {
              upsert: true
            },
            function(err, result) {
              if (err) throw err;
              else {
                res.statusCode = 200;
                res.json(result.presentation[result.presentation.length - 1]);
              }
            });
        });
      });
    });
  });
router.post('/presentation/delete/:id(\\d+)/:presentationid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          protocol: {
            id: req.params.presentationid
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

router.get('/presentation/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.presentation.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.presentation);
      }
    });
  }
);

router.post('/changeRequest/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'changeRequestid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      counter.next;

      var changeRequest = {
        id: counter.next,
        name: req.body.name,
        content: req.body.content
      };
      Project.findOneAndUpdate({
          id: req.params.id
        }, {
          $push: {
            changeRequest: changeRequest
          }
        }, {
          upsert: true
        },
        function(err, result) {
          if (err) throw err;
          else {
            res.statusCode = 200;
            res.json(result.changeRequest[result.changeRequest.length - 1]);
          }
        });
    });
  });
router.post('/changeRequest/delete/:id(\\d+)/:changeRequestid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          changeRequest: {
            id: req.params.changeRequestid
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
router.get('/changeRequest/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.changeRequest.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.changeRequest);
      }
    });
  }
);

router.post('/styleGuide/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'codeStyleid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      counter.next;

      var styleGuide = {
        id: counter.next,
        name: req.body.name,
        content: req.body.content
      };
      Project.findOneAndUpdate({
          id: req.params.id
        }, {
          $push: {
            codeStyle: styleGuide
          }
        }, {
          upsert: true
        },
        function(err, result) {
          if (err) throw err;
          else {
            res.statusCode = 200;
            res.json(result.codeStyle[result.codeStyle.length - 1]);
          }
        });
    });
  });
router.post('/styleGuide/delete/:id(\\d+)/:styleGuideid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          codeStyle: {
            id: req.params.styleGuideid
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
router.get('/styleGuide/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.codeStyle.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.codeStyle);
      }
    });
  }
);

router.post('/report/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'monthlyReportid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      counter.next;

      var report = {
        id: counter.next,
        month: req.body.month,
        content: req.body.content
      };
      Project.findOneAndUpdate({
          id: req.params.id
        }, {
          $push: {
            monthlyReport: report
          }
        }, {
          upsert: true
        },
        function(err, result) {
          if (err) throw err;
          else {
            res.statusCode = 200;
            res.json(result.monthlyReport[result.monthlyReport.length - 1]);
          }
        });
    });
  });
router.post('/report/delete/:id(\\d+)/:reportid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          monthlyReport: {
            id: req.params.reportid
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
router.get('/report/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.monthlyReport.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.monthlyReport);
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
