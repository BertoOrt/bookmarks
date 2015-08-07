$( document ).ready(function() {
  $('.category').click(function () {
    $( this ).toggleClass( "selected" );
  });
  $('#submit').on('click', function (e) {
    var categories = $('.selected').text();
    $('#categories').val(categories);
    e.preventDefault;
  })
  $('.delete-bookmark').click(function () {
    var confirmation = window.confirm('Are you sure you want to delete this bookmark?');
    if (!confirmation){
      event.preventDefault();
    }
  });
  $('#favorite').click(function () {
    var url = $(location).attr('href').split('/');
    var bookmark = url[6];
    var user = url[4];
    var checked = $('#favorite:checked').val();
    if (checked === 'on') {
      $.get('/favorite?bookmark='+bookmark+'&user='+user+'&checked='+'yes')
    } else {
      $.get('/favorite?bookmark='+bookmark+'&user='+user+'&checked='+'no')
    }
  })
  $('.search').keyup(function () {
    $('.results').html('');
    if ($(this).val() !== '') {
      $.get('/search?search=' + $(this).val(), function (response) {
        response.categories.forEach(function (category) {
          console.log(category);
          $('.results').append('<h3>' + category.name + '</h3>')
          category.bookmarks.forEach(function (bookmark) {
            $('.results').append('<p><a href=/users/'+bookmark.userId+'/bookmarks/'+bookmark._id+'>'+bookmark.name+'</a>'+ ' by '+bookmark.user[0].name+'</p>')
          })
        })
      })
    }
  })
});
