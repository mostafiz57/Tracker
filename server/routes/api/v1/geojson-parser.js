var baseIconUrl = '/static/img/pp/car/';
var format = require('util').format;
var _ = require('lodash');

var GeoJsonParser = function(col, splitter) {
	this.splitter = splitter || '|';
	this.properties = col.split(this.splitter).map(function (item) {
		item.trim();
		return item;
	});
};

GeoJsonParser.prototype.parseIcon =function(obj) {
	var icon = baseIconUrl + 'car_%s%s.png';
	var color = '', heading = '';
	if(obj.SpeedKPH < 5) {
		color = 'red';
		heading = '';
		return format(icon, color, heading);
	}
	if(obj.SpeedKPH < 32) {
		color = 'yellow';
	} else {
		color = 'green';
	}
	var h = Math.floor(obj.Heading / 45) ;
	heading = '_h' + h;
	return format(icon, color, heading);
};

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
	};
	return geojson;
};

GeoJsonParser.prototype.parseArray = function(array) {
	console.log(array);
	var self = this;
	var features = array.map(function (it) {
		return self.parseRow(it);
	});
	var result = {
		type: 'FeatureCollection',
		features: features
	};
	return result;
};

module.exports = GeoJsonParser;