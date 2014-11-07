var request = require('supertest');
var expect = require('expect.js');
var app = require ('../server');

describe('auth', function () {
	var id;
	var account = {
		user: 'admin',
		password: 'qwerty123'
	};
	var cookies;

	it('login', function (done) {
		this.timeout(5000);
		request(app).
			post('/auth').
			send(account).
			end(function(err, res){
				expect(err).to.be(null);
				console.log(res.headers);
				expect(res.headers.location).to.be('/dashboard');
				expect(res.headers.token).to.be.a('string');
				done();
			});
	});

	it('should not login', function (done) {
		this.timeout(10000);
		request(app).
			post('/auth').
			send({
				user: 'some random',
				password: 'saf'
			}).
			end(function(err, res){
				expect(err).to.be(null);
				console.log(res.headers);
				expect(res.headers.location).to.be('/');
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

