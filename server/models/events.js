var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  deviceID: {type: String, ref: 'Device', index:true},
  posision: {
    latitude: Number,
    longitude: Number
  },
  detail: {},
  epoch: {type: Date}
});

eventSchema.index({deviceID: 1, posision: 1}, {uinque: true});

module.exports = mongoose.model('Event', eventSchema);
