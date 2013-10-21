
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var server = require('http');
var path = require('path');

bcrypt = require('bcrypt');
var Database = require('./databaseprovider').Database;
BSON = require('./databaseprovider').BSON;
ObjectID = require('./databaseprovider').ObjectID;
User = require('./models/User').User;
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
app.use(function(req,res){
    res.render('404', {user: req.session.user});
});



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

database= new Database('localhost', 27017);

app.get('/', routes.index);
app.put('/befriend/', user.befriend);
app.delete('/unfriend', user.unfriend);
app.get('/user/:id', user.profile);
app.get('/users', user.list);
app.get('/login', user.login);
app.get('/logout', user.logout);
app.get('/friends', user.friends);
app.post('/register', user.register);
app.get('/search', user.search);
app.post('/ball/add_to_user', user.add_ball_to_user);
app.get('/connected_users', routes.connected_users)


var httpServer = server.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(httpServer);

connected_users = {};
var chat = io.of('/chat')
    .on('connection', function (socket) {
        socket.on('join_chat', function (user_id) {

            if (user_id in connected_users) {
                user = connected_users[user_id];
                user.socket = socket;
                for (var i = 0; i < user.rooms.length; ++i){
                    var room  = user.rooms[i];
                    user.socket.join(room);
                    var message = {
                        'message': user.user.name+' Has reconnected to the chat',
                        'room': room,
                        'sender': {
                            'name': '',
                            'id': ''
                        }
                    };
                    user.socket.broadcast.to(room).emit('message', message);
                }
                chat.emit('update_connected');
            }else{
                database.user_exists({_id: BSON.ObjectID(user_id)}, function(error, user){
                    if (!error){
                        connected_users[user_id] = {'user': new User(user), 'socket': socket, 'rooms': []};
                        chat.emit('update_connected');
                    }else{
                        console.log('User does not exist. How can one who does not exist join?!!!');
                    }
                });
            }
        });


        socket.on('create_chatroom', function (data) {
            var room_name = 'room #' + Object.keys(io.sockets.manager.rooms).length;
            var user_id = data.user_id;
            var with_id = data.with_id;
            connected_users[user_id].socket.join(room_name);
            connected_users[user_id].rooms.push(room_name);
            connected_users[with_id].socket.join(room_name);
            connected_users[with_id].rooms.push(room_name);
            var message = {
                'message': 'WELCOME TO '+room_name,
                'room': room_name,
                'sender': {
                    'name': connected_users[user_id].name,
                    'id': connected_users[user_id].id
                },
                'room_name': connected_users[user_id].user.name
            };
            connected_users[with_id].socket.emit('message', message);
            message.room_name = connected_users[with_id].user.name;
            connected_users[user_id].socket.emit('message', message);
        });
        socket.on('invite_chatroom', function (data) {
            var room_name = data.room_name;
            var invited_user = data.invited_user_id;
            console.log(data);
            connected_users[invited_user].socket.join(room_name);
            connected_users[invited_user].rooms.push(room_name);
            var message = {
                'message': 'WELCOME TO '+room_name,
                'room': room_name,
                'sender': {
                    'name': connected_users[invited_user].name,
                    'id': connected_users[invited_user].id
                },
                'room_name': connected_users[invited_user].user.name
            };
            connected_users[invited_user].socket.emit('message', message);
            message.message = connected_users[invited_user].user.name + " has joined the room!";
            connected_users[invited_user].socket.broadcast.to(room_name).emit('message', message);
        });


        socket.on('send_message', function (data) {
            console.log(socket);

            var sender = connected_users[data.user_id].user;
            var response = {
                'message': data.message,
                'room': data.room,
                'sender': {
                    'name': sender.name,
                    'id': sender.id
                }
            };
            socket.broadcast.to(data.room).emit('message', response);
            socket.emit('message', response);
        });

    });


