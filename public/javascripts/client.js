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
  $('#submit').submit(function (e) {
    if ($('#password').val().trim() === '' && $('#name').val().trim() === '') {
      $('.errors').html('<p>please input a name</p><br><p>and a password</p>')
      e.preventDefault();
    } else if ($('#password').val().trim() === '') {
      $('.errors').html('<p>please input a password</p>')
      e.preventDefault();
    } else if ($('#name').val().trim() === '') {
      $('.errors').html('<p>please input a name</p>')
      e.preventDefault();
    } else if ($('#name').val().trim().length < 3 || $('#password').val().trim().length < 3) {
      $('.errors').html('<p>Input too short. Make it more than 3 characters</p>')
      e.preventDefault();
    } else if ($('#name').val().trim().length > 15 || $('#password').val().trim().length > 15) {
      $('.errors').html('<p>Input too long. Make it less than 15 characters</p>')
      e.preventDefault();
    }
  })
});
