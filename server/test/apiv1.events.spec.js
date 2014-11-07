var request = require('supertest');
var expect = require('chai').expect;
var app = require ('../server');

describe('api events server', function () {
	var id;
	var account = {
		user: 'admin',
		password: 'qwerty123'
	};
	var token;

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

	// it('should get all fleet event detail', function(done){
	// 	console.log(token);
	// 	this.timeout(10000);
	// 	request(app).
	// 		get('/api/v1/events/').
	// 		set('Authorization', 'Bearer '+ token).
	// 		end(function(err, res){
	// 			expect(err).to.be(null);
	// 			console.log(res.body);
	// 			expect(res.body.data).to.be.an('array');
	// 			done();
	// 		});
	// });

	it('should get all event for one device', function(done){
		this.timeout(10000);
		request(app).
			get('/api/v1/device/tg102_1202128599/event').
			set('Authorization', 'Bearer '+ token).
			end(function(err, res){
				expect(err).to.be.null;
				console.log(res.body);
				expect(res.body.data).to.be.an('object');
				expect(res.body.data.type).to.equal('FeatureCollection');
				console.log(res.body.data.features[0]);
				done();
			});
	});

	it('should get all event for one device in a period of time', function(done){
		this.timeout(10000);
		request(app).
			get('/api/v1/device/tg102_1202128599/event?from=1410230792&to=1410232792').
			set('Authorization', 'Bearer '+ token).
			end(function(err, res){
				expect(err).to.be.null;
				expect(res.body.data).to.be.an('object');
				expect(res.body.data.type).to.equal('FeatureCollection');
				console.log(res.body.data.features[0]);
				done();
			});
	});
});
