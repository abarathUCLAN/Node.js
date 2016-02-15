var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../libs/app');
var should = chai.should();
var supertest = require("supertest");
var mail = 'user105@mail.com';

var backend = supertest.agent("http://localhost:8000");

it('Server should gesponse with 200', function(done) {
  backend
    .get('/')
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
});

it('Login should be successfull with right credentials', function(done) {
  backend
    .post('/api/users')
    .send({
      "grant_type": "password",
      "client_id": "f3d259ddd3ed8ff3843839b",
      "client_secret": "4c7f6f8fa93d59c45502c0ae8c4a95b",
      "username": "barath1058@gmail.com2",
      "password": "abc1234"
    })
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('access_token');
      res.body.should.have.property('refresh_token');
      done();
    });
});

it('Login should fail because of wrong user credentials', function(done) {
  backend
    .post('/api/users')
    .send({
      "grant_type": "password",
      "client_id": "f3d259ddd3ed8ff3843839b",
      "client_secret": "4c7f6f8fa93d59c45502c0ae8c4a95b",
      "username": "wrong@mail.com2",
      "password": "wrongpassword"
    })
    .end(function(err, res) {
      res.status.should.equal(403);
      res.body.should.be.a('object');
      res.body.should.have.property('error').equal('invalid_grant');
      res.body.should.have.property('error_description').equal('Invalid resource owner credentials');
      done();
    });
});


it('Register validation should fail because firstname is not available', function(done) {
  backend
    .post('/api/users/register')
    .send({
      'lastname': 'Barath',
      'email': 'test10@mail.com',
      'password': '80c3266081df50cf8b16b9b8493a1a1c'
    })
    .end(function(err, res) {
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').equal('Validation failed');
      res.body.should.have.property('name').equal('ValidationError');
      res.body.should.have.property('errors');
      res.body.errors.firstname.should.have.property('message').equal("Path `firstname` is required.");
      res.body.errors.firstname.should.have.property('name').equal('ValidatorError');
      res.body.errors.firstname.should.have.property('path').equal('firstname');
      res.body.errors.firstname.should.have.property('type').equal('required');
      done();
    });
});

it('Register validation should fail because lastname is not available', function(done) {
  backend
    .post('/api/users/register')
    .send({
      'firstname': 'Alexander',
      'email': 'test10@mail.com',
      'password': '80c3266081df50cf8b16b9b8493a1a1c'
    })
    .end(function(err, res) {
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message').equal('Validation failed');
      res.body.should.have.property('name').equal('ValidationError');
      res.body.should.have.property('errors');
      res.body.errors.lastname.should.have.property('message').equal("Path `lastname` is required.");
      res.body.errors.lastname.should.have.property('name').equal('ValidatorError');
      res.body.errors.lastname.should.have.property('path').equal('lastname');
      res.body.errors.lastname.should.have.property('type').equal('required');
      done();
    });
});

it('Register should be successfull', function(done) {
  backend
    .post('/api/users/register')
    .send({
      'lastname': 'Barath',
      'firstname': 'Alexander',
      'email': mail,
      'password': '80c3266081df50cf8b16b9b8493a1a1c'
    })
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
});

it('Register should fail because email already taken', function(done) {
  backend
    .post('/api/users/register')
    .send({
      'lastname': 'Barath',
      'firstname': 'Alexander',
      'email': mail,
      'password': '80c3266081df50cf8b16b9b8493a1a1c'
    })
    .end(function(err, res) {
      res.status.should.equal(400);
      done();
    });
});
