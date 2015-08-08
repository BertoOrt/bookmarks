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
  $('#confirmation').keyup(function (e) {
    if ($('#password').val() === $('#confirmation').val()) {
      $('.match').html('passwords match!')
    }
    else {
      $('.match').html('passwords do not match!')
    }
  })
  $('#favorite').click(function () {
    var url = $(location).attr('href').split('/');
    var bookmark = url[6];
    var checked = $('#favorite:checked').val();
    if (checked === 'on') {
      $.get('/favorite?bookmark='+bookmark+'&checked='+'yes')
    } else {
      $.get('/favorite?bookmark='+bookmark+'&checked='+'no')
    }
  })
  $('.search').keyup(function () {
    $('.results').html('');
    if ($(this).val().trim() !== '') {
      $.get('/search?search=' + $(this).val().trim(), function (response) {
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
  al => alert('shit');
  al()
});
