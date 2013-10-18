$(function() {
    $('body').on('click', '#search-button', function(){
        search();
    });

    $('#search-results').on('click', '.close', function(){
        $('#search-results').slideUp();
    });

    $(document).keypress(function(e) {
        if(e.which == 13) {
            search();
        }
    });
    $(document).keypress(function(e) {
        if(e.which == 0) {
            $('#search-results').slideUp();
        }
    });

});
var search = function(){
    $('#search-cleaner').html('');
    var search_term = $('#search-input').val();
    $.get('/search', {search_term: search_term}, function(data){
        if (data.length != 0){
            for (var i=0; i<data.length; ++i){
                var result = $('#search-result-template').clone().removeAttr('id').show();
                result.find('.search-user-link').text(data[i].name).attr('href', '/user/' + data[i]._id);
                result.find('.start-chat').attr('data-id', data[i]._id);
                $('#search-cleaner').append(result);
            }
            $('#search-results').slideDown();
        }else{
            var result = $('#search-result-template').clone().removeAttr('id').show();
            result.find('.search-user-link').text('No result!').attr('href', '/user/#Nothing_here-FOOL');
            $('#search-cleaner').append(result);
        }


    } );
};