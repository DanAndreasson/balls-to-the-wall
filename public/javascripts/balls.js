const MIN_CHAR = 1;
const MAX_CHAR = 140;

$(function() {
    $.each($('.ball'), function(index, ball){
        fix_size($(ball));
    });

    $('#drop-a-ball').on('click', function(){
        $('#ball-workshop').slideToggle();
    });

    $('#ball-ready').on('click', function(){
        var input_message = $('#message-input').val();
        var input_length = input_message.length;
        if (input_length < MIN_CHAR){
            console.log("Message is to short. At least " + MIN_CHAR + " chars. You're missing " + (MIN_CHAR-input_length) + " chars");
        }else if (input_length > MAX_CHAR){
            console.log("Message is to long. Max " + MAX_CHAR + " chars. You got " + (input_length-MAX_CHAR) + " chars to many");
        }else{
            var receiver_id = $('#user-data').data('id');
            $.post('/ball/add_to_user',
                {
                    receiver_id: receiver_id,
                    message: input_message
                }
                , function(data){
                    $('#ball-workshop').slideUp('fast');
                    var new_ball = $(document.createElement('div')).addClass('ball')
                        .append($(document.createElement('div')).addClass('message').text(data.message));
                    $('#balls').prepend(new_ball);
                    fix_size(new_ball);

            });
        }
    });

});

var fix_size = function(ball){
    var size = ball.height()+10;
    ball.width(size).height(size);

};