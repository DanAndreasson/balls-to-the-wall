$(function() {
    $('body').on('click', '#search-button', function(){
        $('#search-cleaner').html('');
        var search_term = $('#search-input').val();
        $.get('/search', {search_term: search_term}, function(data){
            if (data.length != 0){
                for (var i=0; i<data.length; ++i){
                    $('#search-cleaner').append($(document.createElement('a')).attr('href', '/user/'+data[i]._id).text(data[i].name)
                        .addClass('search-result'));
                }
                $('#search-results').slideDown();
            }else{
                $('#search-cleaner').append($(document.createElement('a')).attr('href', '#No-user..FOOL').text('No results..')
                    .addClass('search-result'));
                $('#search-results').slideDown();
            }


        } );
    });

    $('#search-results').on('click', '.close', function(){
        $('#search-results').slideUp();
    });


});