var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var caretakerSchema = new mongoose.Schema({
	 userName: { type: String},
  	email: { type: String},
  	cfRefNum: [{type: mongoose.Schema.Types.ObjectId,
                ref: 'cf'}],
  	password: { type: String},
  	dateCreated: { type: Date, default: Date.now}
});

caretakerSchema.pre('save', function(next){
  var user = this;
  bcrypt.genSalt(10, function(err, salt){
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash){
      if (err) return next(err);
      else{
        user.password = hash;
        next();
      }
    })
  })
})

caretakerSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password)
};

module.exports = mongoose.model('caretaker', caretakerSchema);