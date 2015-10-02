var Caretaker = require('../models/caretaker.js');

module.exports = {

	create: function(req, res){
		var newCaretaker = new Caretaker(req.body);
		newCaretaker.save(function (err, result) {
			if (err) {
				return res.status(500).end();
			}
			return res.json(result);
		})
	},

	login: function(req, res){
		console.log(req.body);
		return res.status(200).json(req.user);
	}


}