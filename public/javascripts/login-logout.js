$(function() {
    fixActiveNav();
    $('#login-form').on('submit', function(e){
        e.preventDefault();
        $.get('/login',$(this).serialize(),function(data, response, id){
            location.reload();
        }).fail(function(data, response,status){
                if (data.status == 400){
                    $('#login-error-400').slideDown().fadeIn();
                }else if (data.status == 500){
                    $('#login-error-500').slideDown().fadeIn();
                }
            });
        return false;
    });
    $('body').on('click','#logout', function(){
        $.get('/logout', function(){
            location.reload();
        });
    });

    $('#register-form').on('submit', function(e){
        e.preventDefault();


        if ($(this).find('input[name="password"]').val() != $(this).find('input[name="password_again"]').val())
            $('#register-error-password').slideDown().fadeIn();
        console.log($(this).serialize());
        $.post('/register',$(this).serialize(),function(){
            //location.reload();
        }).fail(function(data){
                if (data.status == 400){
                    $('#login-error-400').slideDown().fadeIn();
                }else{
                    $('#login-error-500').slideDown().fadeIn();
                }
            });
        return false;
    });

    /*$('.nav li').on('click', function(){
        $('.active').removeClass('active');
        $(this).addClass('active');
    });*/
});

var fixActiveNav = function(){
    var first_path = window.location.pathname.split('/')[1];
    $('.nav li[js-nav="'+ first_path +'"]').addClass('active');

};