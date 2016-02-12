var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var methodOverride = require('method-override');
var multipart = require('connect-multiparty');
var libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');

var config = require('./config');
var log = require('./log')(module);
var oauth2 = require('./auth/oauth2');

var api = require('./routes/api');
var users = require('./routes/users');
var articles = require('./routes/articles');
var projects = require('./routes/projects');
var invitations = require('./routes/invitations');
var preliminaryStudies = require('./routes/preliminaryStudies');
var requirementSpecifications = require('./routes/requirementSpecifications');
var functionalSpecifications = require('./routes/functionalSpecifications');
var finalizations = require('./routes/finalizations');
var miscellaneous = require('./routes/miscellaneous');

var app = express();

var cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(passport.initialize());

app.use('/', api);
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/articles', articles);
app.use('/api/invitations', invitations);
app.use('/api/projects', projects);
app.use('/api/preliminaryStudy', preliminaryStudies);
app.use('/api/miscellaneous', miscellaneous);
app.use('/api/functionalSpecification', functionalSpecifications);
app.use('/api/requirementSpecification', requirementSpecifications);
app.use('/api/finalization', finalizations);
app.use('/api/users', oauth2.token);



// catch 404 and forward to error handler
app.use(function(req, res, next){
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
    	error: 'Not found'
    });
    return;
});

// error handlers
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
    	error: err.message
    });
    return;
});

module.exports = app;
