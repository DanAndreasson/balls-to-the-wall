var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSONPure;
var ObjectID = require('mongodb').ObjectID;

Database = function(host, port) {
    this.db= new Db('balls-to-the-wall', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
    this.db.open(function(){});
};


Database.prototype.getUsersCollection= function(callback) {
    this.db.collection('users', function(error, user_collection) {
        if( error ) callback(error);
        else callback(null, user_collection); // If there was not error, return the users
    });
};

Database.prototype.getBallsCollection= function(callback) {
    this.db.collection('balls', function(error, balls_collection) {
        if( error ) callback(error);
        else callback(null, balls_collection); // If there was not error, return the users
    });
};


Database.prototype.allUsers = function(callback) {
    this.getUsersCollection(function(error, user_collection) {
        if( error ) callback(error)
        else {
            user_collection.find().toArray(function(error, results) {
                if( error ) callback(error)
                else callback(null, results) //returns all users as an array
            });
        }
    });
};

Database.prototype.user_exists = function(query, callback){
    this.getUsersCollection(function(error, user_collection) {
        if( error ) callback(error)
        else {
            user_collection.find(query).toArray(function(error, result) {
                if( error) callback(error)
                else if (result[0] == undefined) callback('User not found')
                else callback(null, result[0]) //returns first user
            });
        }
    });
};


Database.prototype.createUser = function(user, callback) {
    this.getUsersCollection(function(error, user_collection) {
        if( error ) callback(error)
        else {
            user_collection.insert(user);
            callback(null, user)
        }
    });
};

Database.prototype.addFriendUser = function(user_email,friend_id, callback) {
    this.getUsersCollection(function(error, user_collection) {
        if( error ) callback(error)
        else {
            var updated_user = user_collection.update(
                {
                    email: user_email
                },
                {
                    $push: {friends: friend_id}
                });
            callback(null, updated_user);
        }
    });
};

Database.prototype.removeFriendUser = function(user_email,friend_id, callback) {
    this.getUsersCollection(function(error, user_collection) {
        if( error ) callback(error)
        else {
            user_collection.findAndModify(
                {email: user_email},
                [],
                {$pull: {friends: friend_id}},
                {new: true}
                ,function(err, updated_user){
                    callback(null, updated_user);
                });
        }
    });
};

Database.prototype.getBallsByUser = function(user_id, callback){
    this.getBallsCollection(function(error, ball_collection) {
        if( error ) callback(error)
        else {
            ball_collection.find(
                {$or:[
                    {receiver: user_id},
                    {created_by: user_id}
                ]},
                function(err, unsorted_balls){
                    unsorted_balls.sort({created_at: -1},function(err, balls){
                        balls.toArray(function(error, results) {
                            if( error ) callback(error)
                            else callback(null, results)
                        });
                    });
                });
        }
    });
};

Database.prototype.getAllFriends = function(friends_id, callback){
    this.getUsersCollection(function(error, user_collection) {
        if( error ) callback(error)
        else {
            friends_id.forEach(function(friend, index) {friends_id[index] = new BSON.ObjectID(friend);})
            user_collection.find({_id: {$in: friends_id}}).toArray(function(error, result){
                if( error ) callback(error)
                else callback(null, result)
            });
        }
    });
};

Database.prototype.searchUsers = function(search_term, callback){
    this.getUsersCollection(function(error, user_collection) {
        if( error ) callback(error)
        else {
            var search_regex = new RegExp(search_term, 'i'); // 'i' to make it case insensitive
            user_collection.find({name: search_regex}).toArray(function(error, result){
                if( error ) callback(error)
                else callback(null, result)
            });
        }
    });
};

Database.prototype.add_ball = function(ball, callback){
    this.getBallsCollection(function(error, ball_collection){
        if ( error ) callback(error)
        else {
            ball_collection.insert(ball);
            callback(null, ball);
        }
    });
};

Database.prototype.get_wall_balls = function(friends_id, user_id, callback){
    this.getBallsCollection(function(error, balls_collection){
        if (error) callback(error);
        else{
            friends_id.forEach(function(friend, index) {friends_id[index] = new BSON.ObjectID(friend);})
            balls_collection.find(
                {$or: [
                    {receiver: {$in: friends_id}},
                    {created_by: {$in: [friends_id, user_id]}}

                ]},
                function(err, unsorted_balls){
                    unsorted_balls.sort({created_at: -1},function(err, balls){
                        balls.toArray(function(error, results) {
                            if( error ) callback(error)
                            else callback(null, results)
                        });
                    });
                });
        }

    })
};

exports.Database = Database;
exports.BSON = BSON;
exports.ObjectID = ObjectID;