
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log(req.session);
    if (req.session.user == undefined){
        res.render('index',
          {
              title: 'Balls to the Wall'
          });
    }else{ //User is logged in
        database.get_wall_balls(req.session.user.friends,BSON.ObjectID(req.session.user.id), function(err, balls){
            res.render('home',
                {
                    title: req.session.user.name+"'s Wall of Balls",
                    user: req.session.user,
                    balls: balls
                });
        });
    }
};
exports.connected_users = function(req,res){
    var return_connected_users= [];
    for (var index in connected_users)
    {
        if(req.session.user.id != connected_users[index].user.id)
            return_connected_users.push(connected_users[index].user);
    }
    res.send(return_connected_users);


};


