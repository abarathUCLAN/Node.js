var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var Project = require(libs + 'model/project');
var Counter = require(libs + 'model/counter');

router.post('/projectIntroduction/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          introduction: req.body.content
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

router.post('/projectIntroduction/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          introduction: null
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

router.get('/projectIntroduction/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.introduction == null || result.introduction == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          content: result.introduction
        });
      }
    });
  }
);

router.post('/projectResult/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          result: req.body.content
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

router.post('/projectResult/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          result: null
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

router.get('/projectResult/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.result == null || result.result == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          content: result.result
        });
      }
    });
  }
);

router.post('/projectUse/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          use: req.body.content
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

router.post('/projectUse/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          use: null
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

router.get('/projectUse/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.use == null || result.use == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          content: result.use
        });
      }
    });
  }
);

router.post('/actualState/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          actualState: req.body.content
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

router.post('/actualState/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          actualState: null
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

router.get('/actualState/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.actualState == null || result.actualState == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          content: result.actualState
        });
      }
    });
  }
);

router.post('/targetState/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          targetState: req.body.content
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

router.post('/targetState/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          targetState: null
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

router.get('/targetState/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.targetState == null || result.targetState == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          content: result.targetState
        });
      }
    });
  }
);

router.post('/productData/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          productData: req.body.content
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

router.post('/productData/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          productData: null
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

router.get('/productData/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.productData == null || result.productData == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          content: result.productData
        });
      }
    });
  }
);

router.post('/projectQuality/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          quality: req.body.content
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

router.post('/projectQuality/delete/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $set: {
          quality: null
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

router.get('/projectQuality/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.quality == null || result.quality == undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json({
          content: result.quality
        });
      }
    });
  }
);

router.get('/needToHave/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.needs.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.needs);
      }
    });
  }
);

router.post('/needToHave/delete/:id(\\d+)/:needid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          needs: {
            id: req.params.needid
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

router.post('/needToHave/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'needid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      counter.next;

      var need = {
        id: counter.next,
        name: req.body.name,
        content: req.body.content
      };
      Project.findOneAndUpdate({
          id: req.params.id
        }, {
          $push: {
            needs: need
          }
        }, {
          upsert: true
        },
        function(err, result) {
          if (err) throw err;
          else {
            res.statusCode = 200;
            res.json(result.needs[result.needs.length - 1]);
          }
        });
    });
  });

router.post('/niceToHave/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'niceid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      counter.next;

      var nice = {
        id: counter.next,
        name: req.body.name,
        content: req.body.content
      };
      Project.findOneAndUpdate({
          id: req.params.id
        }, {
          $push: {
            nices: nice
          }
        }, {
          upsert: true
        },
        function(err, result) {
          if (err) throw err;
          else {
            res.statusCode = 200;
            res.json(result.nices[result.nices.length - 1]);
          }
        });
    });
  });
router.post('/niceToHave/delete/:id(\\d+)/:niceid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          nices: {
            id: req.params.niceid
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
router.get('/niceToHave/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.nices.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.nices);
      }
    });
  }
);

router.post('/nonFunctionalRequirement/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Counter.findAndModify({
      _id: 'nonfunctionalid'
    }, [], {
      $inc: {
        next: 1
      }
    }, {}, function(err, counter) {
      counter.next;

      var nonFunctionalRequirement = {
        id: counter.next,
        name: req.body.name,
        content: req.body.content
      };
      Project.findOneAndUpdate({
          id: req.params.id
        }, {
          $push: {
            nonfunctional: nonFunctionalRequirement
          }
        }, {
          upsert: true
        },
        function(err, result) {
          if (err) throw err;
          else {
            res.statusCode = 200;
            res.json(result.nonfunctional[result.nonfunctional.length - 1]);
          }
        });
    });
  });
router.post('/nonFunctionalRequirement/delete/:id(\\d+)/:nonFunctionalRequirementid(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.update({
        id: req.params.id
      }, {
        $pull: {
          nonfunctional: {
            id: req.params.nonFunctionalRequirementid
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
router.get('/nonFunctionalRequirement/:id(\\d+)', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Project.findOne({
      id: req.params.id
    }, function(err, result) {
      if (err) throw err;
      if (result.nonfunctional.length == 0) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(result.nonfunctional);
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
