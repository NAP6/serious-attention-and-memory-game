import { Modal } from "./Modal.js";


$(document).ready( function () {
    var modal_section = document.getElementById('modal_section');

    var agregar = new Modal();
    agregar.appendTo(modal_section);
    agregar.id = 'myModal';

    var myModal = new bootstrap.Modal(document.getElementById(agregar.id), {})

    $('#btn-addGroup').click(()=>{
        agregar.show();
    });
});
