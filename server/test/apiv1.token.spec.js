var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../server');

describe('token authorize', function () {
  it('not authenticate with wrong password', function (done) {
    request(app).
      post('/api/auth').
      send({
        user: 'john',
        password: 'doe'
      }).
      end(function (error, response) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(401);
        //expect(response.text).to.equal('Wrong user or password');
        done();
      });
    });

  it('send a token', function(done){
    request(app).
      post('/api/auth').
      send({
        user: 'admin',
        password: 'qwerty123'
      }).
      end(function(error, response){
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        console.log(response.body.token);
        expect(response.body.token).to.be.a('string');
        done();
      });
  });
});

describe('decode token', function (done) {
  var token;
  before(function (done) {
    request(app).
      post('/api/auth').
      send({
        user: 'admin',
        password: 'qwerty123'
      }).
      end(function(error, response){
        token = response.body.token;
        console.log(token);
        done();
      });
  });

  it('should return profile info', function (done) {
    var header = 'Bearer ' + token;
    console.log(header);
    request(app).
      get('/api/v1/restricted').
      set('Authorization', header).
      end(function (error, response) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        expect(response.body.profile).to.be.an('object');
        done();
      });
  });
});
