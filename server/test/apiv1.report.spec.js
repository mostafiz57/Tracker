var request = require('supertest');
var expect = require('expect.js');
var app = require ('../server');

describe('api server', function () {
	var id;
	var account = {
		user: 'admin',
		password: 'qwerty123'
	};
	var token;
	var connection = app.mongoose.connection;

	before(function (done) {
		this.timeout(10000);
		request(app)
			.post('/auth')
			.send(account)
			.end(function (err, res) {
				token = res.headers.token;
				done();
			});
	});

	it('should get report', function(done){
		console.log(token);
		this.timeout(10000);
		request(app).
			get('/api/v1/device/tg102_1202128599/report/').
			set('Authorization', 'Bearer '+ token).
			end(function(err, res){
				expect(err).to.be(null);
				console.log(res.body);
				done();
			});
	});

	it('should get report details', function(done){
		this.timeout(10000);
		request(app).
			get('/api/v1/device/tg102_1202128599/report/EventDetail').
			set('Authorization', 'Bearer '+ token).
			end(function(err, res){
				expect(err).to.be(null);
				console.log(res.body);
				done();
			});
	});
});
