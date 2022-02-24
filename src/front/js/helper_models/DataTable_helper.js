function start_DataTable(table_id, func) {
    $(document).ready( function () {
        var dt = $(`#${table_id}`).DataTable({
            language: {
                processing:     "En curso...",
                search:         "Buscar:",
                lengthMenu:     "Mostrar _MENU_ elementos",
                info:          "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                infoEmpty:      "Mostrando 0 a 0 de 0 entradas",
                infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                infoPostFix:    "",
                loadingRecords: "Cargando...",
                zeroRecords:    "No hay registros",
                emptyTable:     "No hay datos disponibles en la tabla",
                paginate: {
                    first:      " << ",
                    previous:   " < ",
                    next:       " > ",
                    last:       " >> "
                },
                aria: {
                    sortAscending:  ": activar para ordenar la columna ascendente",
                    sortDescending: ": activar para ordenar la columna descendente"
                }
            }
        });
        func(dt);
    });
}

export { start_DataTable }
