var CF = require('../models/cf.js');

module.exports = {

	create: function(req, res){
		var newCF = new CF(req.body);
		newCF.save(function (err, result) {
			if (err) {
				return res.status(500).end();
			}
			return res.json(result);
		})
	},

	delete: function(req, res) {
	    CF.findByIdAndRemove(req.params.id, function(err, result) {
	      if (err) return res.status(500).send(err);
	      res.json(result);
	    });
	},

	update: function(req, res) {
	    CF.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, result) {
	      if (err) return res.status(500).send(err);
	      res.json(result);
	    })
	},

	read: function(req, res){
		CF.find({School: req.body}, function(err, result){
			if (err) return res.status(500).send(err);
	      	res.json(result);
		})
	},

	getLocation: function(req, res){
		CF.find({School: req.params.id},function(err, result){
		if (err) return res.status(500).send(err);
      	res.json(result);
	 })
	}

};