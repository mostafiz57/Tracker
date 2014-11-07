var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var handlebarEng = require('express-handlebars');
var flash = require('connect-flash');

var mongoose = require('mongoose');
var Tracker = require('./libs/tracker');

var serverConfig = require('./config/server');
var dbConfig = require('./config/database');
var trackerConfig = require('./config/tracker');

mongoose.connect(dbConfig.url);
Tracker.init({
	account: trackerConfig.account,
	debug: true
});

var port = serverConfig.port;

app.engine('hbs', handlebarEng({
	extname: 'hbs',
	defaultLayout: 'main.hbs'
}));
app.set('view engine', 'hbs');
app.use(function (err, req, res, next) {
	console.log(err.stack);
	res.send(500);
});

//app config middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
	type: 'applicaion/vnd.api+json'
}));
app.use(cookieParser());
app.use(session({
	secret: "secret",
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 24*60*60*1000}
}));
app.use(methodOverride());
app.use(flash());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    next();
});
//config routes
require('./routes/static')(app, serverConfig);
require('./routes/auth').auth(app, Tracker);
require('./routes/api')(app, Tracker);
require('./routes/api/v1')(app);
require('./routes/main')(app, serverConfig);

//start server
app.listen(port);
console.log('Serving in port ' + port);
module.exports = app; //for test with supertest
module.exports.mongoose = mongoose;
