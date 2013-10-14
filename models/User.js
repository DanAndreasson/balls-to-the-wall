User = function(user_data){
    this.name = user_data['name'];
    this.email = user_data['email'];
    this.picture = user_data['picture'];
    this.password = user_data['password'];
    this.friends = user_data['friends'];
    this.id = user_data['_id'];
    if (user_data['friends'] == undefined)
        this.friends = []

};

exports.User = User;
