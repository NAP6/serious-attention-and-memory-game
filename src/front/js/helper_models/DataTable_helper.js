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
                //loadingRecords: "Chargement en cours...",
                //zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
                //emptyTable:     "Aucune donnée disponible dans le tableau",
                paginate: {
                    first:      " << ",
                    previous:   " < ",
                    next:       " > ",
                    last:       " >> "
                },
                //aria: {
                    //sortAscending:  ": activer pour trier la colonne par ordre croissant",
                    //sortDescending: ": activer pour trier la colonne par ordre décroissant"
                //}
            }
        });
        func(dt);
    });
}

export { start_DataTable }
