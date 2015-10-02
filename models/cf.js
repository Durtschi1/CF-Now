var mongoose = require('mongoose');

var cfSchema = new mongoose.Schema({
	Status: {type: String},
	Name: { type: String},
  	School: {type: mongoose.Schema.Types.ObjectId,
                ref: 'school'},
    Caretaker: {type: mongoose.Schema.Types.ObjectId,
    		ref: 'caretaker'},           
  	Grade: {type: String},
  	Updated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('cf', cfSchema);