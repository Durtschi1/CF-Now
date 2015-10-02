var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var cferCtrl = require('./controllers/cferCtrl');
var schoolCtrl = require('./controllers/schoolCtrl');
var caretakerCtrl = require('./controllers/caretakerCtrl');

var cf = require('./models/cf.js');
var school = require('./models/school.js');
var caretaker = require('./models/caretaker.js');


var app = express();
var port = 8085;
var mongoUri = 'mongodb://localhost:27017/CF';

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
	secret: 'ilikepizzapie'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user,done){
	done(null, user);
});
passport.deserializeUser(function(obj,done){
	done(null, obj);
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		caretaker.findOne({email: username}, function(err, user) {
			if (err) {return done(err); }
			if (!user) {
				return done(null, false, {message: 'Incorrect email' });
			}
			if (!user.comparePassword(password)) {
				return done(null, false, {message: 'Incorrect password' });
			}
			return done(null, user);
		})
}));

app.post('/api/caretaker/create', caretakerCtrl.create);
app.post('/api/caretaker/login', passport.authenticate('local'), caretakerCtrl.login)
app.post('/api/cf/create', cferCtrl.create);
app.post('/api/school/create', schoolCtrl.create);
app.post('/api/school/addCaretaker/:schoolId', schoolCtrl.addCaretaker);

// app.get('/api/caretaker', caretakerCtrl.read);
// app.get('/api/cf', cferCtrl.read);
app.get('/api/school/getId/:id', schoolCtrl.read);
app.get('/api/cf/getCfer/:id', cferCtrl.getLocation);
// app.put('/api/caretaker/:id', caretakerCtrl.update);
app.put('/api/cf/:id', cferCtrl.update);
// app.put('/api/school/:id', schoolCtrl.update);

app.delete('/api/cf/:id', cferCtrl.delete);

mongoose.connect(mongoUri);
mongoose.connection.once('open', function(){
  console.log('Connected to MongoDB at ', mongoUri)
});

app.listen(port, function(){
    console.log('Now listening on port: ', port);
});