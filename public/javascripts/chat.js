var chat = io.connect('http://localhost:3000/chat'); // TIP: .connect with no args does auto-discovery
var user_id;
$(function() {
    user_id = $('#user-data').attr('data-id');

    chat.emit('join_chat', user_id);

    chat.on('connect', function (data) {
        console.log('connected!');
    });

    chat.on('update_chatroom_users', function (data) {
        console.log(data);
        update_chatroom_users(data.room, data.users)
    });

    chat.on('message', function (data) {
        var room = data.room;
        if ($('.chat[data-id="'+room+'"]').length == 0)
            add_chat(data.room_name, room);
        if (data.update == true){
            chat.emit('update_chatroom_users',
                {
                    'room':data.room,
                    'asker': user_id
                });
        }
        add_message({'name': data.sender.name, 'id': data.sender.id}, data.message, room);
    });

    chat.on('inviteable_users', function(data){
        var room = data.room;
        var activefriends = $('.chat[data-id="'+room+'"]').find('.activefriends');
        activefriends.html('');
        $.each(data.users, function(index, con_user){
            var activefriend = $(document.createElement('a')).addClass('activefriend').attr("data-id", con_user.id).text(con_user.name);
            activefriends.prepend(activefriend);
        });
    });

    $('#idle-chats').on('click', '.idle-chat', function(){
        swap_chat($(this).data('id'));
    });

    $('#chats').on('click', '.chat-post', function(e){
        e.preventDefault();
        var message = $(this).parent().find('.chat-input').val();
        var room = $(this).parent().parent().attr('data-id');
        if (message.length > 0)
            chat.emit('send_message', {'message':message, 'user_id': user_id, 'room': room});
        $(this).parent().find('.chat-input').val('');
    });

    $('#chats').on('click', '.invitebutton', function(e){
            e.preventDefault();
            var activefriends = $(this).parent().find('.activefriends');
            if (activefriends.css('display') == 'none'){
                var room = $(this).parent().data('id');
                chat.emit('get_inviteable_users',
                    {
                        'user_id': user_id,
                        'room': room
                    });
                activefriends.toggle();
                $(this)
                    .addClass('btn-danger')
                    .removeClass('btn-success')
                    .text('Close');
            }else{
                activefriends.toggle();
                $(this)
                    .addClass('btn-success')
                    .removeClass('btn-danger')
                    .text('Invite');
            }
        });

    $('#chats').on('click', '.activefriend', function(e){
        e.preventDefault();
        chat.emit('invite_chatroom',
            {
                'invited_user_id':$(this).data('id'),
                'room_name': $(this).parent().parent().data('id')
            });
        $(this).parent().slideToggle();
        $(this).parent().parent().find('.invitebutton')
            .addClass('btn-success')
            .removeClass('btn-danger')
            .text('Invite');
    });

    $('#chats').on('click', '.close', function(){
        $('#chat-container').slideToggle();
    });

    $('#search-results').on('click', '.start-chat', function(){
        var chat_with = $(this).data('id');
        chat.emit('create_chatroom', {'user_id': user_id, 'with_id': chat_with});

    });

});

var swap_chat = function(id){
    $('.idle-chat.active').removeClass('active');
    $('.idle-chat[data-id="'+id+'"]').addClass('active').show();

    $('.chat.active-chat').removeClass('active-chat').hide();
    $('.chat[data-id="'+id+'"]').addClass('active-chat').show();
};

var add_chat = function(chat_with, id){
    if ($('#chat-container').css('display') == 'none')
        $('#chat-container').slideToggle('fast');
    var new_chat = $('#chat-template .chat').clone();
    new_chat
        .attr('data-with', chat_with)
        .attr('data-id', id);
    $('#chats').append(new_chat);
    var new_chat_button =  $(document.createElement('div')).addClass('idle-chat').addClass('rotate')
        .text(chat_with).attr('data-id', id);
    $('#idle-chats').append(new_chat_button);
    swap_chat(id);
    update_chatroom_users(id,[{'name': chat_with}]);
    chat.emit('update_chatroom_users',
        {
            'room':id,
            'asker': user_id
        });
};

var add_message = function(sender, message, chat_id){
    var chat = $('.chat[data-id="'+chat_id+'"]');
    chat.find('.message-container').append(
        $(document.createElement('div')).addClass('message')
            .append($(document.createElement('a')).text(sender.name)
                .attr('href', '/user/'+sender.id).addClass('user'))
            .append(document.createTextNode(message))
    );
};

var update_chatroom_users = function(chat_room, connected_users){
    var chat_head = $('.chat[data-id="'+chat_room+'"]').find('.chat-head');
    if (connected_users.length == 1){
        chat_head.html('<h2>'+connected_users[0].name+'</h2>');
    }else{
        chat_head.html('').append($(document.createElement('div')).addClass('users-room-container'));
        $.each(connected_users, function(index, con_user){
            var user_in_room = $(document.createElement('a')).attr('href', '/user/'+con_user.id).addClass('user-in-room').attr("data-id", con_user.id).text(con_user.name);
            chat_head.find('.users-room-container').append(user_in_room);
        });
    }
};

