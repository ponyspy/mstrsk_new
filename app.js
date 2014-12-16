var mongoose = require('mongoose');
		mongoose.connect('localhost', 'main');

var express = require('express'),
		bodyParser = require('body-parser'),
		multer = require('multer'),
		accepts = require('accepts'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		sessionMongoose = require('mongoose-session')(mongoose),
		methodOverride = require('method-override'),
			app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

if (process.env.NODE_ENV == 'development') {
	var skip_auth = true;
	mongoose.set('debug', false);
	app.set('json spaces', 2);
	app.locals.pretty = true;
	app.use(express.static(__dirname + '/public'));
}

app.use(multer({ dest: __dirname + '/uploads'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());

app.use(session({
	key: 'session',
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat',
	cookie: {
		path: '/',
		maxAge: 1000 * 60 * 60 // 1 hour
	},
	store: sessionMongoose
}));

app.use(function(req, res, next) {
	res.locals.session = req.session;
	res.locals.locale = req.cookies.locale || 'ru';
	next();
});


// ------------------------
// *** Midleware Block ***
// ------------------------


function checkAuth (req, res, next) {
	if (req.session.user_id || skip_auth) {
		res.locals.admin = true;
		next();
	}
	else {
		res.redirect('/login');
	}
}


// -------------------
// *** Router Block ***
// -------------------


var Router = {
	'base': {
		main: require('./routes/base/main.js'),
		events: require('./routes/base/events.js'),
		food: require('./routes/base/food.js'),
		request: require('./routes/base/request.js')
	},
	'auth': require('./routes/auth.js'),
	'admin': {
		events: require('./routes/admin/events.js'),
		requests: require('./routes/admin/requests.js'),
		options: require('./routes/admin/options.js')
	},
	'static': {
		content: require('./routes/static/content.js'),
		files: require('./routes/static/files.js')
	},
	'old': {
		globals: require('./routes/old/globals.js'),
		api: require('./routes/old/api.js')
	}
}


// ------------------------
// *** Base Routes Block ***
// ------------------------


// === Main Route
app.route('/').get(Router.base.main.index);

// === Events Route
// app.route('/events').get(Router.base.events.index);

// === Event Route
app.route('/events/:id').get(Router.base.events.event);

// === Food Route
app.route('/food').get(Router.base.food.index);


// ------------------------
// *** Admin Routes Block ***
// ------------------------


// === Admin events Route
// app.route('/auth/events').get(checkAuth, Router.admin.events.list);

// === Admin @add events Route
app.route('/auth/events/add')
	 // .get(checkAuth, Router.admin.events.add)
	 // .post(checkAuth, Router.admin.events.add_form);

// === Admin @edit events Route
app.route('/auth/events/edit/:id')
	 // .get(checkAuth, Router.admin.events.edit)
	 // .post(checkAuth, Router.admin.events.edit_form);

app.route('/preview')
	 // .post(Router.admin.options.preview)


// ------------------------
// *** Auth Routes Block ***
// ------------------------


// === Auth Route
app.route('/auth').get(checkAuth, Router.auth.main);

// === Login Route
app.route('/login')
	 .get(Router.auth.login)
	 .post(Router.auth.login_form);

// === Logout Route
app.route('/logout').get(Router.auth.logout);

// === Registr Route
app.route('/registr')
	 .get(Router.auth.registr)
	 .post(Router.auth.registr_form);


// ------------------------
// *** Static Routes Block ***
// ------------------------


// === Contacts Route
app.route('/contacts').get(Router.static.content.contacts);


// ------------------------
// *** Old Routes Block ***
// ------------------------


// === Files #sitemap.xml Route
app.route('/sitemap.xml').get(Router.static.files.sitemap);

// === Files #robots.txt Route
app.route('/robots.txt').get(Router.static.files.robots);


// ------------------------
// *** Globals Routers Block ***
// ------------------------


// === Locale Route
app.route('/lang/:locale').get(Router.old.globals.locale);

// === Search Route
app.route('/search').post(Router.old.globals.search);


// ------------------------
// *** API Routes Block ***
// ------------------------


// === API v1 Route
app.route('/api/v1').get(Router.old.api.check, Router.old.api.v1);


// ------------------------
// *** Error Handling Block ***
// ------------------------


app.use(function(req, res, next) {
	var accept = accepts(req);
	res.status(404);

	// respond with html page
	if (accept.types('html')) {
		res.render('error', { url: req.url, status: 404 });
		return;
	}

	// respond with json
	if (accept.types('json')) {
			res.send({
			error: {
				status: 'Not found'
			}
		});
		return;
	}

	// default to plain-text
	res.type('txt').send('Not found');
});

app.use(function(err, req, res, next) {
	var status = err.status || 500;

	res.status(status);
	res.render('error', { error: err, status: status });
});


// ------------------------
// *** Connect server Block ***
// ------------------------


app.listen(3000);
console.log('http://127.0.0.1:3000')