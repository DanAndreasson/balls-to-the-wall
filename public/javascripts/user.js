$(function() {
    $('#befriend').on('click', function(){
        $.ajax({
            url: '/befriend/',
            type: 'PUT',
            data: {id: $('#user-data').data('id')},
            success: function(result) {
                location.reload();
            },
            failure: function() {
                $('#friend-error').slideDown().fadeIn();
            }
        });
    });

    $('#unfriend').on('click', function(){
        $.ajax({
            url: '/unfriend/',
            type: 'DELETE',
            data: {id: $('#user-data').data('id')},
            success: function(result) {
                location.reload();
            },
            failure: function() {
                $('#friend-error').slideDown().fadeIn();
            }
        });
    });
});