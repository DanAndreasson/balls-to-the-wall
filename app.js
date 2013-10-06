
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
bcrypt = require('bcrypt');
var Database = require('./databaseprovider').Database;
BSON = require('./databaseprovider').BSON;
ObjectID = require('./databaseprovider').ObjectID;
User = require('./models/User').User
var app = express();



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('supersecretkey'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));




// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

database= new Database('localhost', 27017);

app.get('/', routes.index);
app.put('/befriend/', user.befriend);
app.delete('/unfriend/', user.unfriend);
app.get('/user/:id', user.show);
app.get('/users', user.list);
app.get('/login', user.login);
app.get('/logout', user.logout)
app.get('/friends', user.friends);
app.post('/register', user.register)
app.get('/search', user.search);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

