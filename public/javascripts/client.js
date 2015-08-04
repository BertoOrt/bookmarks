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
});
