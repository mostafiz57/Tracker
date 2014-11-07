var request = require('supertest');
var expect = require('expect.js');
var app = require ('../server');

describe('api server', function () {
	var id;
	var base = 'http://localhost:6969/api/';
	var account = {
		user: 'admin',
		password: 'qwerty123'
	};
	var cookies;
	var connection = app.mongoose.connection;

	before(function (done) {
		this.timeout(10000);
		connection.on('open', function(){
			connection.db.dropDatabase(function(){
				console.log('clear');
				request(app)
					.post('/auth')
					.send(account)
					.end(function (err, res) {
						cookies = res.headers['set-cookie'];
						done();
					});
			});
		});
	});

	it('should get list of all device', function (done) {
		//increase timeout a little bit
		this.timeout(10000);
		request(app).
			get('/api/v1/devices').
			set('Cookie', cookies).
			end(function (err, res) {
				expect(err).to.eql(null);
				expect(res.body.data).to.be.an('array');
				done();
			});
	});

	it('should get one device with all common spec', function (done) {
		this.timeout(10000);
		request(app).
			get('/api/v1/device/tg102_1202128599').
			set('Cookie', cookies).
			end(function (err, res) {
				expect(err).to.eql(null);
				console.log(res.body);
				done();
			});
	});

	it('should get report', function(done){
		this.timeout(10000);
		request(app).
			get('/api/v1/device/tg102_1202128599/report/').
			set('Cookie', cookies).
			end(function(err, res){
				expect(err).to.be(null);
				console.log(res.body);
				done();
			});

	});
});
