var _ = require('lodash');
var Event = require('../../models/events');
var baseIconUrl = '/static/img/pp/car/';
var format = require('util').format;

/* input
ID|VIN |DeviceDesc|Epoch|Date|Time|Timezone|StatusCodeDesc|Icon|Latitude|Longitude|GPSAge|CreateAge|Accuracy|#Sats|SpeedKPH|Heading|Altitude|Odometer|Stopped|GPIO|Address|extra...

output:
{
	type: 'Feature',
	geometry: {
		type: 'Point',
		coordinates: [latitude, longitude;]
	},
	properties: {
		type: 'fleet',
		id: ID,
		epoch: Epoch,
		timezone: TimeZone,
		status: StatusCodeDesc,
		address: Address,
		gpsAge: GPSAge,
		createdAge: CreateAge,
		accuracy: Accuracy,
		sat: #Sats,
		speedKPH: SpeedKPH,
		heading:
		altitude:
		odometer:
		stopped:
		GPIO:
	}
}
*/

var GeoJsonParser = function(col, splitter) {
	this.splitter = splitter || '|'
	this.properties = _.map(col.split(this.splitter), function (item) {
		item.trim();
		return item;
	});
}

GeoJsonParser.prototype.parseIcon =function(obj) {
	var icon = baseIconUrl + 'car_%s%s.png';
	var color = '', heading = '';
	if(obj.SpeedKPH < 5) {
		color = 'red';
		heading = '';
		return format(icon, color, heading);
	}
	if(obj.SpeedKPH < 32) {
		color = 'yellow'
	} else {
		color = 'green'
	}
	var h = Math.floor(obj.Heading / 45) ;
	heading = '_h' + h;
	return format(icon, color, heading);
}

GeoJsonParser.prototype.parseRow = function(str) {
	var data = str.split(this.splitter);
	var obj = _.object(this.properties, data);
	//map to geojson object;
	var geojson = {
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [parseFloat(obj.Longitude), parseFloat(obj.Latitude)]
		},
		properties: {
			type: 'fleet',
			id: obj.ID,
			description: obj.DeviceDesc,
			epoch: obj.Epoch,
			timezone: obj.TimeZone,
			status: obj.StatusCodeDesc,
			address: obj.Address,
			gpsAge: obj.GPSAge,
			createdAge: obj.CreateAge,
			accuracy: obj.Accuracy,
			sat: obj["#Sats"],
			speedKPH: obj.SpeedKPH,
			heading: obj.Heading,
			altitude: obj.Altitude,
			odometer: obj.Odometer,
			stopped: obj.Stopped,
			GPIO: obj.GPIO,
			icon: this.parseIcon(obj)
		}
	}
	return geojson;
};

GeoJsonParser.prototype.parseArray = function(array) {
	console.log(array);
	var self = this;
	var features = _.map(array, function (it) {
		return self.parseRow(it);
	});
	var result = {
		type: 'FeatureCollection',
		features: features
	};
	return result;
};

module.exports = function(router, Tracker) {

	router.get('/map/fleet', function (req, res) {
		console.log(req.user);
		//get last position of device or group
		var groupid = req.query.groupid || 'all';
		var deviceid = req.query.deviceid;

		var params = {
			authentication: req.user,
			data:{
				groupid: groupid,
				deviceid: deviceid
			}
		};

		Tracker.api('getmapfleet', params, function(trackerError, data){
			if(!data || data.status){
				res.statusCode = 500;
				res.json(data);
			} else {
				console.log(data);
				var data = data.JMapData;
				var geoJsonParser = new GeoJsonParser(data.DataColumns);
				var features = _.map(data.DataSets, function (item) {
					var json = geoJsonParser.parseRow(item.Points[0]);
					json.id = item.id
					return json;
				});
				res.json(features);
			}
		});
	});

	router.get('/map/device', function (req, res) {
		var deviceid = req.query.id;
		var timefrom = req.query.from,
				timeto = req.query.to;

		if(!deviceid || !timefrom || !timeto) {
			res.statusCode = 400; //bad request
			return res.json({
				message: "No device or time selected"
			});
		}

		var params = {
			authentication:req.user,
			data:{
				deviceid: deviceid,
				timefrom: timefrom,
				timeto: timeto
			}
		};

		Tracker.api('getmapdevice', params, function(trackerError, data){
			if(!data || data.status){
				res.statusCode = 500;
				res.json(data);
			} else {
				var data = data.JMapData;
				var geoJsonParser = new GeoJsonParser(data.DataColumns);

				var lineCoordinates = [];
        if(data.DataSets.length === 0) {
            res.json({});
            return;
        }
				var dataSet = data.DataSets[0].Points;
				var features = _.map(dataSet, function (item) {
					var point = geoJsonParser.parseRow(item);
					lineCoordinates.push(point.geometry.coordinates);
					return point;
				});

				var line = {
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: lineCoordinates
					}
				};

				var points  = {
					type: 'FeatureCollection',
					features: features
				};

				res.json([line, points]);
			}
		});
	});

};
