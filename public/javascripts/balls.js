$(function() {
    $.each($('.ball'), function(index, ball){
        fix_size($(ball));
    });


});

var fix_size = function(ball){
    var size = ball.height()+10;
    ball.width(size).height(size);
};