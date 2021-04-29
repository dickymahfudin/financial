$(document).ready(function () {
  const url = $('#dataTable').attr('url');
  const parsUrl = url.split('/')[1];
  $.ajax({
    type: 'GET',
    url,
    dataType: 'json',
    success: function (response) {
      let findImage = response.columns.findIndex((e) => e.data === 'image');
      response.columns[findImage] = {
        data: 'image',
        title: 'IMAGE',
        searchable: false,
        sortable: false,
        render: function (data, type, full, meta) {
          return `<a href="${data}" data-toggle="lightbox" data-max-width="600"> <img src="${data}" class="img-fluid" alt="income"/><a/>`;
        },
        mData: 'image',
        sTitle: 'IMAGE',
      };
      if (parsUrl != 'dashboard') {
        response.columns.push({
          data: 'id',
          title: '',
          searchable: false,
          sortable: false,
          render: function (id, type, full, meta) {
            return `<span><a href="/${parsUrl}/form/${id}" class="modal-open" title="Edit ${full.name}" id="${id}"><i class="fas fa-edit"></i></a> |
              <a href="/${parsUrl}/delete/${id}"  onclick="return confirm('Are you sure you want to delete this item?');" title="Delete ${full.name}" id="${id}"><i class="fas fa-trash text-danger"></i></a></span>
              `;
          },
        });
      }

      $('#dataTable').DataTable({
        rowReorder: {
          selector: 'td:nth-child(2)',
        },
        processing: true,
        retrieve: true,
        responsive: true,
        // dom: "Blrtip",
        data: response.data,
        columns: response.columns,
      });
    },
  });
});
