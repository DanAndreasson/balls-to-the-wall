
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
        res.render('home',
            {
                title: req.session.user.name+"'s Wall of Balls",
                user: req.session.user
            });
    }
};

