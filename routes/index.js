
/*
 * GET home page.
 */

exports.index = function(req, res){
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



