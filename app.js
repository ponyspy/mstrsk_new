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

app.use(function(req, res, next) {
	if (req.query.partner && req.query.referrer) {
		res.locals.ref = '?referrer=' + req.query.referrer + '&' + 'partner=' + req.query.partner;
		res.cookie('partner', req.query.partner);
		res.cookie('referrer', req.query.referrer);
	}
	else if (req.cookies.partner && req.cookies.referrer) {
		res.locals.ref = '?referrer=' + req.cookies.referrer + '&' + 'partner=' + req.cookies.partner;
	}
	else {
		res.locals.ref = ''
	}
	next();
});


// -------------------
// *** Routes Block ***
// -------------------


var main = require('./routes/main.js');
var styles = require('./routes/styles.js');
var objects = require('./routes/objects.js');
var architects = require('./routes/architects.js');
var categorys = require('./routes/categorys.js');
var projects = require('./routes/projects.js');
var subjects = require('./routes/subjects.js');
var auth = require('./routes/auth.js');
var content = require('./routes/content.js');
var files = require('./routes/files.js');
var api = require('./routes/api.js');

var a_ages = require('./routes/admin/ages.js');
var a_objects = require('./routes/admin/objects.js');
var a_subjects = require('./routes/admin/subjects.js');
var a_architects = require('./routes/admin/architects.js');
var a_categorys = require('./routes/admin/categorys.js');
var a_projects = require('./routes/admin/projects.js');

var options = require('./routes/admin/options.js');
var globals = require('./routes/globals.js');


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


// ------------------------
// *** Main Routers Block ***
// ------------------------


// === Main Route
app.route('/').get(main.index);


// === Styles Route
app.route('/styles').get(styles.index);


// === get Objects Route
app.route('/styles/get_objects').post(styles.get_objects);


// === Object Route
app.route('/objects/:id').get(objects.object);


// === Architects Route
app.route('/architects').get(architects.index);


// === Architect Route
app.route('/architects/:id').get(architects.architect);


// === Categorys Route
app.route('/categorys').get(categorys.index);


// === Category Route
app.route('/categorys/:id').get(categorys.category);


// === Subjects Route
app.route('/subjects').get(subjects.index);


// === Subject Route
app.route('/subjects/:id').get(subjects.subject);


// === Projects Route
app.route('/projects').get(projects.index);


// === Projects Route
app.route('/projects/:id').get(projects.project);


// ------------------------
// *** Admin Routers Block ***
// ------------------------


// === Admin ages Route
app.route('/auth/ages').get(checkAuth, a_ages.list);


// === Admin @add ages Route
app.route('/auth/ages/add')
	 .get(checkAuth, a_ages.add)
	 .post(checkAuth, a_ages.add_form);


// === Admin @edit ages Route
app.route('/auth/ages/:id/edit')
	 .get(checkAuth, a_ages.edit)
	 .post(checkAuth, a_ages.edit_form);


// === Admin sub ages Route
app.route('/auth/ages/:id/sub')
	 .get(checkAuth, a_ages.list_sub)


// === Admin @add sub ages Route
app.route('/auth/ages/:age_id/sub/add')
	 .get(checkAuth, a_ages.add)
	 .post(checkAuth, a_ages.add_form);


// === Admin @edit sub ages Route
app.route('/auth/ages/:parent_age_id/sub/edit/:id')
	 .get(checkAuth, a_ages.edit)
	 .post(checkAuth, a_ages.edit_form);


// === Admin objects Route
app.route('/auth/objects').get(checkAuth, a_objects.list);


// === Admin @add objects Route
app.route('/auth/objects/add')
	 .get(checkAuth, a_objects.add)
	 .post(checkAuth, a_objects.add_form);


// === Admin @edit objects Route
app.route('/auth/objects/edit/:id')
	 .get(checkAuth, a_objects.edit)
	 .post(checkAuth, a_objects.edit_form);


// === Admin architects Route
app.route('/auth/architects').get(checkAuth, a_architects.list);


// === Admin @add architects Route
app.route('/auth/architects/add')
	 .get(checkAuth, a_architects.add)
	 .post(checkAuth, a_architects.add_form);


// === Admin @edit architects Route
app.route('/auth/architects/edit/:id')
	 .get(checkAuth, a_architects.edit)
	 .post(checkAuth, a_architects.edit_form);


// === Admin categorys Route
app.route('/auth/categorys').get(checkAuth, a_categorys.list);


// === Admin @add categorys Route
app.route('/auth/categorys/add')
	 .get(checkAuth, a_categorys.add)
	 .post(checkAuth, a_categorys.add_form);


// === Admin @edit categorys Route
app.route('/auth/categorys/edit/:id')
	 .get(checkAuth, a_categorys.edit)
	 .post(checkAuth, a_categorys.edit_form);


// === Admin subjects Route
app.route('/auth/objects/:object_id/subjects').get(checkAuth, a_subjects.list);


// === Admin @add subjects Route
app.route('/auth/objects/:object_id/subjects/add')
	 .get(checkAuth, a_subjects.add)
	 .post(checkAuth, a_subjects.add_form);


// === Admin @edit subjects Route
app.route('/auth/objects/:object_id/subjects/edit/:subject_id')
	 .get(checkAuth, a_subjects.edit)
	 .post(checkAuth, a_subjects.edit_form);


// === Admin @add tiles Route
app.route('/tiles_gen')
	 .post(a_subjects.tiles_gen)


// === Admin projects Route
app.route('/auth/projects').get(checkAuth, a_projects.list);


// === Admin @add projects Route
app.route('/auth/projects/add')
	 .get(checkAuth, a_projects.add)
	 .post(checkAuth, a_projects.add_form);


// === Admin @edit projects Route
app.route('/auth/projects/edit/:id')
	 .get(checkAuth, a_projects.edit)
	 .post(checkAuth, a_projects.edit_form);



// ------------------------
// *** Auth Routers Block ***
// ------------------------


// === Auth Route
app.route('/auth').get(checkAuth, auth.main);


// === Login Route
app.route('/login')
	 .get(auth.login)
	 .post(auth.login_form);


// === Logout Route
app.route('/logout').get(auth.logout);


// === Registr Route
app.route('/registr')
	 .get(auth.registr)
	 .post(auth.registr_form);


// ------------------------
// *** Static Routers Block ***
// ------------------------


// === Contacts Route
app.route('/contacts').get(content.contacts);


// ------------------------
// *** Old Routers Block ***
// ------------------------


// === Files #sitemap.xml Route
app.route('/sitemap.xml').get(files.sitemap);


// === Files #robots.txt Route
app.route('/robots.txt').get(files.robots);


// ------------------------
// *** Options Routers Block ***
// ------------------------


app.route('/preview')
	 .post(options.preview)


// ------------------------
// *** Globals Routers Block ***
// ------------------------


// === Locale Route
app.route('/lang/:locale').get(globals.locale);


// === Search Route
app.route('/search').post(globals.search);


// ------------------------
// *** Globals Routers Block ***
// ------------------------


// === API v1 Route
app.route('/api/v1').get(api.check, api.v1);


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