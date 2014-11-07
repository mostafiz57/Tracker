module.exports.parseFieldQuery = function(req, res, next) {
	var fields = [
		{name: 'id'},
		{name: 'description'}
	]; //default fields
	if(req.query.fields) {
		fields = req.query.fields;
		if(fields.indexOf(',') === -1) {
			fields = [{name:fields}];
		} else {
			fields  = fields.split(',');
			for (var i = 0, length = fields.length; i<length; i++){
				fields[i] = {name: fields[i]};
			}
		}
	}
	req.body.fields = fields;
	next();
}; 