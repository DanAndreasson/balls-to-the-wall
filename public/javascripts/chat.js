var chat = io.connect('http://localhost:3000/chat'); // TIP: .connect with no args does auto-discovery
var user_id;
$(function() {
    user_id = $('#user-data').attr('data-id');
    chat.emit('join_chat', user_id);
    chat.on('connect', function (data) {
        console.log('connected!');
    });

    chat.on('update_connected', function (data) {
    });

    chat.on('message', function (data) {
        var room = data.room;
        if ($('.chat[data-id="'+room+'"]').length == 0){
            add_chat(data.room_name, room);
        }
        add_message({'name': data.sender.name, 'id': data.sender.id}, data.message, room);
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
    var new_chat = $('#chat-template .chat').clone();
    new_chat.find('.chat-head').text(chat_with);
    new_chat
        .attr('data-with', chat_with)
        .attr('data-id', id);
    $('#chats').append(new_chat);
    var new_chat_button =  $(document.createElement('div')).addClass('idle-chat').addClass('rotate')
        .text(chat_with).attr('data-id', id);
    $('#idle-chats').append(new_chat_button);
    swap_chat(id);
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

