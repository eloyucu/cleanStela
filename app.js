var express 		= require('express');
var path 			= require('path');
var favicon 		= require('static-favicon');
var logger 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var cookieSession 	= require('cookie-session');
var i18n 			= require('i18next');
var users	 		= require('./routes/users');
var buildings	 	= require('./routes/buildings');
var users_flats	 	= require('./routes/users_flats');
var emails	 		= require('./routes/email');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    keys: ['papallama&/%><', 'magicGuru123$·"']
}));

i18n.init({
    ns: { namespaces: ['text'], defaultNs: 'text'},
    resSetPath: 'locales/__lng__/new.__ns__.json',
    saveMissing: true,
    debug: true,
	lng:"es",
    sendMissingTo: 'fallback'
});

i18n.registerAppHelper(app)
    .serveClientScript(app)
    .serveDynamicResources(app)
    .serveMissingKeyRoute(app);
	
/*
i18n.serveWebTranslate(app, {
    i18nextWTOptions: {
      languages: ['es', 'dev'],
      namespaces: ['text'],
      resGetPath: "locales/resources.json?lng=__lng__&ns=__ns__",
      resChangePath: 'locales/change/__lng__/__ns__',
      resRemovePath: 'locales/remove/__lng__/__ns__',
      fallbackLng: "dev",
      dynamicLoad: false
    }
});*/

app.use(i18n.handle);
app.use('/', users);
app.use('/', buildings);
app.use('/', users_flats);
app.use('/email/', emails);



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
			user: req.session.user
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
		user: req.session.user
    });
});


app.listen(8080);

module.exports = app;
