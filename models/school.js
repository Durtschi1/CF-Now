var mongoose = require('mongoose');

var schoolSchema = new mongoose.Schema({
  	caretakerRefNum: [{type: mongoose.Schema.Types.ObjectId,
  						ref: 'caretaker'}],
  	placeId: { type: String }
});

module.exports = mongoose.model('school', schoolSchema);