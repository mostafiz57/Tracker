var path = require('path');

module.exports = {
	port: 6969,
  staticUrl: '/static',
  distFolder: path.resolve(__dirname+'/../../client/dist')
};
