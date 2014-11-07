var request = require('supertest');
var expect = require('expect.js');
var app = require ('../server');

describe('group api', function () {
	var id;
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

	it('should get list of all group', function (done) {
		//increase timeout a little bit
		this.timeout(10000);
		request(app).
			get('/api/v1/groups').
			set('Cookie', cookies).
			end(function (err, res) {
				expect(err).to.eql(null);
				expect(res.body.data).to.be.an('array');
				done();
			});
	});

	it('should get one group with all common spec', function (done) {
		this.timeout(10000);
		request(app)
			.get('/api/v1/group/anh_dung')
			.set('Cookie', cookies)
			.end(function (err, res) {
				expect(err).to.eql(null);
				console.log(res.body);
				done();
			});
	});
});
