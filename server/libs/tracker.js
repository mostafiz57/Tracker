/**
*	Interact with tracker server
* @author mahpah
* @version 0.0.1
* @deprecated
*/

var Tracker = (function() {
	var statusCode = require('../config/tracker').statusCode;
	var http = require('http');
	var options = {
		host: 'gps.umaps.vn',
		port: 80,
		baseUrl: '/track/v9'
	},
		COMMAND = [
			'getversion',
			'getmapdata',
			'getmapfleet',
			'getmapdevice',
			'getdevices',
			'createdevice',
			'updatedevice',
			'getgroups',
			'getreports'
		];

	init = function(params){
		options.account = params.account;
		options.host = params.host || options.host;
		options.port = params.port || options.port;
		options.baseUrl = params.baseUrl || options.baseUrl;
		options.debug = params.debug;
	};

	/**
	 * call tracker api
	 * @return {}
	 */
	api = function() {
		if(!options.account){
			throw {
				name: 'SDK Exception',
				message: 'You cannot call api before init'
			};
		}
		if (typeof arguments[0] !== 'string') {
			throw {
				name: 'SDK Exception',
				message: ''
			};
		}
		//parse the arguments
		var args = Array.prototype.slice.call(arguments),
			command = args.shift(),
			next = args.shift(),
			params,
			callback;

		while (next) {
			var type = typeof next;
			if (type === 'function' && !callback) {
				callback = next;
			} else if (type === 'object' && !params) {
				params = next;
			} else {
				console.log('You serious?');
			}
			next = args.shift();
		}

		if (!callback) {
			throw {
				name: 'SDK Exception',
				message: 'You don\'t want to do anything with result, do you?'
			};
		}
		if(!params) {
			throw {
				name: "SDK Exception",
				message: "No authentication information"
			};
		}

		if (COMMAND.indexOf(command) === -1) {
			throw {
				name: "API Exception",
				message: "Command not supportted yet"
			};
		}

		return request(command, params, callback);

	};

	request = function(command, params, callback) {
		var data = {};
		data.authentication = params.authentication;
		data.authentication.account = options.account;
		data.requests = {
			command: command,
			params: params.data
		};

		//for debug
		if(options.debug){
			console.log("TRACKER:", command, data);	
		}
		__post(options.baseUrl, data, callback.bind(this));
	};

	/**
	 * low level http post request
	 * @param  {string}   url
	 * @param  {json}   postData
	 * @param  {function} callback (err, data) function to call when done;
	 * @return {[type]}
	 */
	__post = function(url, postData, callback) {
		postData = JSON.stringify(postData);

		requestOptions = {
			host: options.host,
			port: options.port,
			path: url,
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Content-Length": postData.length
			}
		};

		var request = http.request(requestOptions, function(res) {
			res.setEncoding('utf8');
			var data = "";
			res.on('data', function(chunk) {
				data += chunk;
			});
			res.on('end', function() {
				data = JSON.parse(data);
				if(options.deug) {
					console.dir(data);
				}
				if(callback ){
					if (data.status && !(data.status === 'OK0000' || data.status === 'SUCCESS')) {
						callback({
							error: {
								type: 'Tracker Exception',
								code: data.status
							}
						});
					} else {
						callback(null, data);
					}
				} 
			});
		});
		request.on('error', function (error) {
			callback({error:{
				type: 'Http Exception',
				details: error
			}});
		});
		request.write(postData);
		request.end();
	};

	var map = function(){
		__post();
	};

	return {
		options: options,
		init: init,
		api: api
	};

})();

module.exports = Tracker;
