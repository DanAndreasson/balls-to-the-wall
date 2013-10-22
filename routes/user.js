
/*
 * GET users listing.
 */


exports.add_ball_to_user = function(req, res){
    if (!req.session.user){
        res.send('Not logged in or not friends', 400);
        return ;
    }
    var ball = {};
    if (req.body.receiver_id != 0)
        ball.receiver = new BSON.ObjectID(req.body.receiver_id);
    ball.message = req.body.message;
    ball.created_by = new BSON.ObjectID(req.session.user.id);
    ball.created_at = new Date();
    database.add_ball(ball, function(err, ball){
        if ( !err ){
            res.send(ball, 200);
        }else{
            res.send('Something went wrong!', 500);
        }
    });
};

exports.profile = function(req, res){
    if (!req.session.user){
        res.redirect('/');
        return ;
    }
    var id = req.params.id;
    var oid = new BSON.ObjectID(id);
    database.user_exists({_id: oid},function(err, user){
        if (user){
            var friends_or_not = inObject(req.session.user.friends, oid)
            if (friends_or_not || id == req.session.user.id){
                database.getBallsByUser(oid, function(err, balls){
                    if (!err){
                        res.render('profile',
                            {
                                title: req.session.user.name+"'s Wall of Balls",
                                user: req.session.user,
                                user_profile: user,
                                id: oid,
                                friends: true,
                                balls: balls
                            });
                    }else{
                        res.render('profile',
                            {
                                title: req.session.user.name+"'s Wall of Balls",
                                user: req.session.user,
                                user_profile: user,
                                id: oid,
                                friends: false
                            });
                    }
                });
            }else{
            res.render('profile',
                {
                    title: req.session.user.name+"'s Wall of Balls",
                    user: req.session.user,
                    user_profile: user,
                    id: oid,
                    friends: false
                });
            }
        }else{
            res.render('404',
                {
                });
        }
    });
};


exports.unfriend = function(req, res){
    var id = req.body.id;
    if (!req.session.user && inObject(req.session.user.friends, id)){
        res.send('Not logged in or not friends', 400);
        return ;
    }
    database.removeFriendUser(req.session.user.email, id, function(err, user){
        if (!err){
            req.session.user.friends = user.friends;
            res.send('Successfully removed friend', 200);
        }else{
            res.send('Failed with removal of friend', 500);
        }
    });

};

exports.befriend = function(req, res){
    var id = req.body.id;
    if (!req.session.user && !inObject(req.session.user.friends, id)){
        res.send('Not logged in or already friends', 400);
        return ;
    }


    database.addFriendUser(req.session.user.email, id, function(err){
        if (!err){
            req.session.user.friends.push(id);
            res.send('Befriended', 200);
        }else
            res.send('Not befriended', 500);
    })
};

exports.list = function(req, res){
  database.allUsers(function(err, users){
      res.send(req.session.user);
  });
};

exports.login = function(req, res){
    if (req.session.user != undefined){
        res.send('already logged in', 409);
    }else{
        var email = req.query.email;
        var passw = req.query.password;

        database.user_exists({email: email}, function(err, user){
            if ( !err){
                if (user){
                    if (bcrypt.compareSync(passw, user['password'])){
                        req.session.user = new User(user);
                        res.send('Logged in', 200);
                    }else
                        res.send('Wrong password', 400);
                }else{
                    res.send('Wrong email', 400);
                }
            }else{
                res.send('Something went wrong', 500);
            }
        });
    }
};

exports.logout = function(req, res){
    req.session.destroy();
    res.send('Logout successful', 200);
};

exports.register = function(req, res){
    var user_data = {};
    user_data.email = req.body.email;
    database.user_exists({email: user_data.email}, function(err, user){
        if ( err == 'User not found' || !err){
            if (!user){
                user_data.name = req.body.name;
                var salt = bcrypt.genSaltSync(10);
                user_data.password = bcrypt.hashSync(req.body.password, salt);
                user_data.picture = get_gravatar(user_data.email);
                database.createUser(user_data, function(err, new_user){
                    req.session.user = new User(new_user);
                    res.send('Successfully signed up', 200);
                });
            }else{
                res.send('User with that email already registered', 400);
            }
        }else{
            res.send('Something went wrong', 500);
        }
    });
};

exports.friends = function(req, res) {
    if (!req.session.user){
        res.redirect('/');
        return ;
    }
    database.getAllFriends(req.session.user.friends, function(err, friends){
        if (!err){
            res.render('friends',
                {
                    title: req.session.user.name+"'s Wall of Balls",
                    user: req.session.user,
                    friends: friends
                });
        }else {
            res.redirect('/');
        }
    });
};

exports.search = function(req, res) {
    var search_term = req.query.search_term;
    database.searchUsers(search_term, function(err, results){
        if (!err)
            res.send(results);
        else
            res.send([]);
    });
};


exports.new_balls = function(req, res){
    var data = JSON.parse(req.body);
    var id = new BSON.ObjectID();
    var wall = req.body.wall;
    console.log(id,wall, req.body);
    if (wall){
        database.getBallsByUser(id, function(error, balls){
            if (!err){
                res.send(balls, 200);
            }else{
                res.send('Something went wrong!', 500)
            }
        });
    }else{
        database.user_exists({'_id': id}, function(err, user){
            if (!err){
                database.get_wall_balls(user.friends, id, function(error, balls){
                    if (!err){
                        res.send(balls, 200);
                    }else{
                        res.send('Something went wrong!', 500)
                    }
                });
            }else{
                res.send('Something went wrong!', 500)
            }
        });
    }
};


function get_gravatar(email, size) {
    var MD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
    size = size || 180;
    return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + size;
}
function inObject(arr, search) {
    if (arr == undefined)
        return false;
    var len = arr.length;
    while( len-- ) {
        if(arr[len] == search)
            return true;
    }
    return false;
}

