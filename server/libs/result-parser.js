/**
 * attack more info to the data before send to browser
 * @param {object} data
 */
module.exports.RestParser = function(data) {
	var timestamp = new Date().toISOString();
	var results = {
		data: data,
		timestamp: timestamp
	};

	return results;
};