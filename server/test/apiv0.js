var superagent = require('superagent');
var expect = require('expect.js');

describe('auth', function () {
	it('should login', function (done) {
		superagent.post('http://localhost:6969/auth')
		.send({
			user: 'admin',
			password: 'qwerty123'
		})
		.end(function (err, res) {
			expect(err).to.eql(null);
			expect(res.statusCode).to.be(200);
			done();
		});
	});

	it('shouldn\'t login with wrong pass', function () {
		superagent.post('http://localhost:6969/auth')
		.send({
			user: 'admin',
			password: 'qerty123'
		})
		.end(function (err, res) {
			expect(err).to.eql(null);
			expect(res.statusCode).to.be(401);
			done();
		});
	});
});

describe('api server', function () {
	var id;
	var base = 'http://localhost:6969/api/';
	var account = {
			user: 'admin',
			password: 'qwerty123'
		};
	beforeEach(function () {
		superagent.post('http://localhost:6969/auth')
		.send(account)
		.end(function (err, res) {
			done();
		});
	});
	it('should get list of all device', function (done) {
		superagent.get(base + 'devices')
		.end(function (err, res) {
			expect(err).to.eql(null);
			expect(res.statusCode).not.to.be(401);
			console.log(res);
			done();
		});
	});
});
