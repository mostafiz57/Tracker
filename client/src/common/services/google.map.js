var Marker = function (feature) {
    var coords = feature.geometry.coordinates;
		var pos = {
        lat: coords[1],
        lng: coords[0]
    };
    var popupContent = feature.properties.description;
    var icon = feature.properties.icon;
    var labelContent = feature.properties.description;

    var _marker = new MarkerWithLabel({
        position: pos,
        icon: icon,
				animation: google.maps.Animation.DROP,
        labelContent: labelContent,
        labelAnchor: new google.maps.Point(22,0),
				labelClass: 'marker-label'
    });
    if(feature.id) {
			this.id = feature.id;
		}
  	this._marker = _marker;
    this.popupContent = popupContent;
};

Marker.prototype.update = function (feature) {
	var coords = feature.geometry.coordinates;
	var pos = {
  	lat: coords[1],
    lng: coords[0]
  };
  var popupContent = feature.properties.description;
  var icon = feature.properties.icon;
	this._marker.setPosition(pos);
	this._marker.setIcon(icon);
	this.popupContent = popupContent;
};

Marker.prototype.setMap = function (map) {
	this._marker.setMap(map);
};

Marker.prototype.addEventListener = function (ev, handle) {
	google.maps.event.addListener(this._marker, ev, function (e) {
		handle(e, this);
	});
};

Marker.prototype.getGeometry = function () {
	return this._marker.getPosition();
};

var MarkerLayer = function () {
	this.markers = [];
};

MarkerLayer.prototype.add = function (marker) {
	this.markers.push(marker);
};

MarkerLayer.prototype.addGeoJson = function (features) {
	var self = this;
	if(features instanceof Array) {
		features.forEach(function (f) {
			var id = f.id;
			var marker = self.getById(id);
			if(marker) {
				marker.update(f);
			} else {
				self.addGeoJson(f);
			}
		});
	} else {
		var m = new Marker(features);
		self.add(m);
	}
};

MarkerLayer.prototype.forEach = function (exec, thisArg) {
	var self = this;
	if(!thisArg) thisArg = self;
	self.markers.forEach(function (marker) {
		exec.call(thisArg, marker);
	});
};

MarkerLayer.prototype.setMap = function (map) {
	this.forEach(function (marker) {
		marker.setMap(map);
	});
};

MarkerLayer.prototype.getById = function (id) {
	return _.filter(this.markers, {id: id})[0];
};

angular.module('google.maps', [])

  .provider('GoogleMap', [function GoogleMapProvider () {
    var _mapElm = null;
    var _gmap = google.maps;
		var _markers = {};
    function _setMapElement(str) {
      console.log(str);
      _mapElm = str;
      console.log(_mapElm);
    }

    function _initMap() {
      console.log(this.mapElm);
      var elm;
      var self = this;
      if(!this.mapElm) {
        console.log('Map container not specificed. Create default');
        elm= document.createElement('div');
        elm.setAttribute('id','map-canvas');
        elm.style.height = '100%';
        document.getElementsByTagName('body')[0].appendChild(mapElm);
        this._mapElm = 'map-canvas';
      } else {
        elm = document.getElementById(this.mapElm);
      }
      window.map = this.map = new _gmap.Map(elm, {
        zoom: 2,
        center: new _gmap.LatLng(0, 0)
      });
			this.markerLayer = new MarkerLayer();
      this.popup = new _gmap.InfoWindow();
			this.dataLayer = new _gmap.Data();
    }

		function _clearDataLayer() {
			this.dataLayer.setMap(null);
			this.dataLayer = null;
			this.dataLayer = new _gmap.Data();
		}

    function _zoom(layer) {
      map = this.map;
      var bounds = new _gmap.LatLngBounds();
      layer.forEach(function(feature) {
        _processPoints(feature.getGeometry(), bounds.extend, bounds);
      });
      map.fitBounds(bounds);
    }

    function _processPoints(geometry, callback, thisArg) {
      if (geometry instanceof _gmap.LatLng) {
        callback.call(thisArg, geometry);
      } else if (geometry instanceof google.maps.Data.Point) {
        callback.call(thisArg, geometry.get());
      } else {
        geometry.getArray().forEach(function(g) {
          _processPoints(g, callback, thisArg);
        });
      }
    }

		function _zoomTo(pos) {
			this.map.setCenter(pos);
			this.map.setZoom(13);
		}
    function _bindPopup(feature, content) {
      //add popup to feature
      if(!content) {
        content = feature.getProperty('description');
      }
      this.popup.setContent( content + "<br><br>");
      _processPoints(feature.getGeometry(), this.popup.setPosition, this.popup);
      this.popup.open(this.map);
    }

    function _center(point, zoomLevel) {
      _processPoints(point, this.map.setCenter, this.map);
      zoomLevel =  zoomLevel || 13;
      this.map.setZoom(zoomLevel);
    }

  	function _bindEvent(target, ev, handler, thisArg) {
      if(typeof handler !== 'function') {
        return;
      }
      _gmap.event.addListener(target, ev, function (e) {
        handler.call(thisArg, e);
      });
    }

    function _clearMarkers() {
      if(typeof _markers === 'object') {
        for (var _key in _markers) {
          _markers[_key]._marker.setMap(null);
          _markers[_key] = null;
        }
        _markers = {};
      }
    }

		function _hideMarkers() {
      if(typeof _markers === 'object') {
        for (var _key in _markers) {
          _markers[_key]._marker.setMap(null);
        }
      }
    }

		function _showMarkers() {
      if(typeof _markers === 'object') {
        for (var _key in _markers) {
          _markers[_key]._marker.setMap(this.map);
        }
      }
		}

    return {
      setMapElement: _setMapElement,
      $get: function () {
        return {
          mapElm: _mapElm,
          initMap: _initMap,
          zoom: _zoom,
					zoomTo: _zoomTo,
          bindPopup: _bindPopup,
          center: _center,
					clearDataLayer: _clearDataLayer,
          bind: _bindEvent
        };
      }
    };
  }]);
