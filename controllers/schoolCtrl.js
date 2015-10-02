var School = require('../models/school.js');

module.exports = {

	create: function(req, res){
		var newSchool = new School(req.body);
		newSchool.save(function (err, result) {
			if (err) {
				return res.status(500).end();
			}
			return res.json(result);
		})
	},

	read: function(req, res){
		School.find({placeId: req.params.id}, function(err, result){
			if (err) {
				return res.status(500).end();
			}
			return res.json(result);	
		})
	},

	addCaretaker: function(req, res){
		School.findByIdAndUpdate(req.params.schoolId), {$push: {caretakerRefNum: req.user._id}}, {new:true}, function(err, result){
			if(!err) res.status(200).json(result);
		}
	}

};