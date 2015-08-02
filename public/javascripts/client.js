$( document ).ready(function() {
  $('.category').click(function () {
    $( this ).toggleClass( "selected" );
  });
  $('#submit').on('click', function (e) {
    var categories = $('.selected').text();
    $('#categories').val(categories);
    e.preventDefault;
  })
});
