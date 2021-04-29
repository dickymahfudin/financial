$(document).ready(function () {
  $('body').on('click', '.modal-open', function (e) {
    e.preventDefault();
    const me = $(this),
      id = me.attr('id'),
      url = me.attr('href'),
      title = me.attr('title');
    const parsUrl = url.split('/')[1];
    console.log(parsUrl);
    const action = id == 'add' ? `/${parsUrl}` : `/${parsUrl}/${id}`;
    $('#form').attr('action', action);
    $('#form').attr('method', 'POST');
    parsUrl != 'user' && $('#form').attr('enctype', 'multipart/form-data');
    $.ajax({
      url: url,
      dataType: 'html',
      success: (response) => {
        $('.modal-title').text(title);
        $('.modal-body').html(response);
        return $('#modal').modal('show');
      },
    });
  });
});
